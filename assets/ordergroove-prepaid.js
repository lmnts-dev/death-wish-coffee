// Use with ordergroove_feature_flag: 2023-03-prepaid-selling-plans

// We use it to check which frequency was selected before prepaid box was checked
const previousPayAsYouGoFrequencies = {};
// We need this to account for product variant changes and track last product variant selected
let lastProductVariant = "";

// Waits for window to load to add listeners and will injectPrepaidPlan
const injectPrepaidPlan = () => {
  window.addEventListener("load", () => addListenersAndLoadInitialCheckbox());
};

const addListenersAndLoadInitialCheckbox = () => {
  try {
    if (isProductPrepaidEligible()) {
      renderInitialPrepaidState();
      addListenersToCheckboxes();
      addOptinChangedCallback();
      checkImpulseUpsellChanges();
    }
  } catch (error) {
    console.error("There was an error while adding prepaid listeners: ", error);
  }
  // All the code will be executed only when there are prepaid selling-plans attached to the product
};

const renderInitialPrepaidState = () => {
  const checkbox = getPrepaidCheckbox();
  const ogOffer = getOgOffer();

  lastProductVariant = getProductVariant();
  setPreviousPayAsYouGoFrequency(lastProductVariant);

  // const prepaidContainer = document.querySelector('#og-prepaid-container');
  // const prepaidEnabledOffer = document.querySelector(`og-offer[location="pdp"]`);
  // const optinToggle = prepaidEnabledOffer.querySelector('.og-optout-buttons');
  // optinToggle.appendChild(prepaidContainer);

  const isProductVariantOptedIn = ogOffer.hasAttribute("subscribed");
  if (isProductVariantOptedIn) {
    showCheckboxCurrentVariant();
  }

  const frequency = ogOffer.getAttribute("frequency");

  if (isFrequencyPrepaid(frequency)) {
    checkbox.checked = true;
    showPriceExplainer();
    updatePrices();
    disableAndHideStandardOptins();
  }
};

// Gets all ogOffers generated on the page and add change events to them
// This events will listen to changes on the checkboxes events, so then it will trigger
// og-offers changes
// (when we change something on og-offer changes to the add/cart forms
// will be triggered. Changing the selling-plan-id as a hidden input)
const addListenersToCheckboxes = () => {
  var checkboxes = getPrepaidCheckboxesParentDiv();

  const prepaidEnabledOffer = document.querySelector(
    `og-offer[location="pdp"]`
  );
  addListenerForUpdatingSellingPlanIdOnOffer(prepaidEnabledOffer);
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function(evt) {
      try {
        updatePrepaidSellingPlanIdOnOffer(prepaidEnabledOffer, evt);
      } catch (error) {
        console.error(
          "There was an error while dealing with prepaid state changes: ",
          error
        );
      }
    });
  });
};

// Adds a OptinChangedCallback function that will be called every time
// the client clicks the "Deliver one time" or "Subscribe to save" radio-button
//   We need to listen to this change so we can trigger the checkbox appearing or not
const addOptinChangedCallback = () => {
  OG.addOptinChangedCallback(
    ({ optedIn: isProductVariantOptedIn, productId: productVariantId }) => {
      try {
        if (productVariantId !== getProductVariant()) {
          return;
        }
        if (isProductVariantOptedIn) {
          showCheckboxCurrentVariant();
        } else {
          handleWithOptedOutChanges();
        }
      } catch (error) {
        console.error(
          "There was an error while handling with opt-in/opt-out changes: ",
          error
        );
      }
    }
  );
};

const handleWithOptedOutChanges = () => {
  hideCheckboxCurrentVariant();
  enableAndShowStandardOptins();
  const checkbox = getPrepaidCheckbox();
  checkbox.checked = false;
  updatePrices();
};

const checkImpulseUpsellChanges = () => {
  og.store.subscribe(() => {
    if (upsellEligible()) {
      hideCheckboxCurrentVariant();
    }
  });
};

// Listen to ogOffer change to deal with edge cases and state changing
//  -> These are usually changes that are triggered on the plushtoys components
//     such as clicking the pay-as-you-go button or changing the select
const addListenerForUpdatingSellingPlanIdOnOffer = (ogOffer) => {
  const mutationObserver = new MutationObserver(function(mutations) {
    const productVariant = getProductVariant();
    const frequency = getOptedInFrequency(productVariant);
    const checkbox = getPrepaidCheckbox();

    setPreviousPayAsYouGoFrequency(productVariant);
    hideCheckboxSpecificVariant(lastProductVariant);
    if (isProductOptedIn(productVariant)) {
      showCheckboxSpecificVariant(productVariant);
    }

    lastProductVariant = productVariant;

    if (isFrequencyPrepaid(frequency)) {
      checkbox.checked = true;
      disableAndHideStandardOptins();
      showPriceExplainer();
    } else {
      enableAndShowStandardOptins();
      hidePriceExplainer();
    }
    updatePrices();
  });
  mutationObserver.observe(ogOffer, {
    attributeFilter: ["product"],
  });
};

const isProductOptedIn = (productVariant) => {
  let store = og.store.getState();
  let optedInProducts = store.optedin;
  return optedInProducts.some((product) => product.id === productVariant);
};

const isFrequencyPrepaid = (frequency) =>
  frequency && frequency.includes("PREPAID");

const updatePrepaidSellingPlanIdOnOffer = (ogOffer, evt) => {
  const checkboxElement = getPrepaidCheckbox();
  const isOptedinIntoPrepaidPlan = checkboxElement.checked;
  const prepaidSellingPlanId = getSelectedPrepaidSellingPlanId();
  const prepaidFrequencyKey = getPrepaidFrequencyKey(prepaidSellingPlanId);
  const variantId = ogOffer.getAttribute("product");

  if (isOptedinIntoPrepaidPlan) {
    setPreviousPayAsYouGoFrequency(variantId);
    og.store.dispatch({
      type: "PRODUCT_CHANGE_FREQUENCY",
      payload: {
        product: {
          id: variantId,
        },
        frequency: prepaidFrequencyKey,
      },
    });
    disableAndHideStandardOptins();
    showPriceExplainer();
  } else {
    if (!previousPayAsYouGoFrequencies[variantId]) {
      setPreviousPayAsYouGoFrequency(variantId);
    }

    enableAndShowStandardOptins();
    hidePriceExplainer();
    og.store.dispatch({
      type: "PRODUCT_CHANGE_FREQUENCY",
      payload: {
        product: {
          id: variantId,
        },
        frequency: previousPayAsYouGoFrequencies[variantId],
      },
    });
  }
  updatePrices();
  lastProductVariant = variantId;
};

const getPrepaidFrequencyKey = (prepaidSellingPlanId) => {
  const prepaidSellingPlanElement = document.querySelector(
    `span[selling-plan-id="${prepaidSellingPlanId}"]`
  );
  const elementId = prepaidSellingPlanElement.id;
  const idParts = elementId.split("-");
  const shippingFrequency = idParts[idParts.length - 1];
  const prepaidShipments = idParts[idParts.length - 3];
  return `${prepaidShipments}-PREPAID-${shippingFrequency}`;
};

const disableAndHideStandardOptins = () => {

  const ogOptins = document.querySelector('.og-optin-buttons')

  if (ogOptins) {
    ogOptins.style["display"] = "none";
    ogOptins.style["pointer-events"] = "none";
  }

  const deliveryEveryText = getDeliveryEvery(getOgOffer());
  if (deliveryEveryText) {
    deliveryEveryText.style["display"] = "none";
  }
};

const enableAndShowStandardOptins = () => {

  const ogOptins = document.querySelector('.og-optin-buttons')

  if (ogOptins) {
    ogOptins.style["display"] = "flex";
    ogOptins.style["pointer-events"] = "";
  }

  const deliveryEveryText = getDeliveryEvery(getOgOffer());
  if (deliveryEveryText) {
    deliveryEveryText.style["display"] = "block";
  }
};

const updatePrices = () => {
  // This incentive is rc3 configured on Subscriptions -> Enrollment -> Subscription sub copy
  // So in case there is no percentage it will probably break
  let priceIncentiveTextWithDiscountPercentage = document.querySelector(
    "og-offer .og-offer-incentive"
  );

  const productVariant = getProductVariant();
  const prepaidCheckbox = getPrepaidCheckbox();
  const prepaidChecked = prepaidCheckbox ? getPrepaidCheckbox().checked : false;
  const prepaidPercentage = parseInt(getPrepaidPercentagePrice(productVariant));
  const payAsYouGoPercentage = getPayAsYouGoPercentagePrice(productVariant);
  const newPercentage = prepaidChecked
    ? prepaidPercentage
    : payAsYouGoPercentage;

  if (priceIncentiveTextWithDiscountPercentage) {
    // Comment this in case the percentage is not updating (this could happen because there are different versions of the pdp with different elements)
    priceIncentiveTextWithDiscountPercentage = priceIncentiveTextWithDiscountPercentage.querySelector(
      "og-incentive-text"
    );
    const discountRegex = /[0-9]{1,2}%/;

    if (newPercentage && !isNaN(newPercentage)) {
      priceIncentiveTextWithDiscountPercentage.innerHTML = priceIncentiveTextWithDiscountPercentage.innerHTML.replace(
        discountRegex,
        `${newPercentage}%`
      );
    }
  }

  const prepaidTotalPrice = getPrepaidTotalPrice();
  changeTotalPrice(prepaidTotalPrice);

  changePrepaidPercentage(prepaidPercentage);
};

const removeDollarAndGetFloatFromPrice = (price) =>
  parseFloat(price.replace("$", ""));

const setPreviousPayAsYouGoFrequency = (variantId) => {
  const newFrequency = getOptedInFrequency(variantId);
  //If no previous frequency has been populared, use a default one from the sellingPlanMap
  if (!newFrequency || isFrequencyPrepaid(newFrequency)) {
    previousPayAsYouGoFrequencies[variantId] = getPayAsYouGoFrequencyFromMap();
  } else {
    previousPayAsYouGoFrequencies[variantId] = newFrequency;
  }
};

const changeTotalPrice = (newTotalPrice) => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv();
  const pricePerDeliveryElement = prepaidCheckboxDiv.querySelector(
    ".og-total-prepaid-price"
  );
  if (pricePerDeliveryElement) {
    pricePerDeliveryElement.innerHTML = newTotalPrice;
  }
};

const changePricePerDelivery = (newPerDeliveryPrice) => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv();
  const pricePerDeliveryElement = prepaidCheckboxDiv.querySelector(
    "og-prepaid-price-per-delivery"
  );
  if (pricePerDeliveryElement) {
    pricePerDeliveryElement.innerHTML = newPerDeliveryPrice;
  }
};

const changePrepaidPercentage = (newExtraPercentage) => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv();
  const extraPercentageElement = prepaidCheckboxDiv.querySelector(
    ".og-prepaid-percentage"
  );
  if (extraPercentageElement) {
    extraPercentageElement.innerHTML = newExtraPercentage;
  }
};

const getPrepaidPercentagePrice = (productVariant) => {
  return +getSelectedPrepaidOption().getAttribute("data-prepaid_percentage");
};

const getPayAsYouGoPercentagePrice = (productVariant) => {
  let payAsYouGoOffer = getPayAsYouGoOffer(productVariant);
  if (!payAsYouGoOffer || payAsYouGoOffer.length === 0) {
    console.error(
      "There is no pay as you go offer added to this product variant: ",
      productVariant
    );
    return;
  }
  return parseFloat(payAsYouGoOffer[1].replace("%", ""));
};

const getPayAsYouGoOffer = (productVariant) => {
  const offers = getOffers();
  const optedInFrequency = getOptedInFrequency(productVariant);
  let frequency = previousPayAsYouGoFrequencies[productVariant];
  if (!frequency || isFrequencyPrepaid(frequency)) {
    frequency = getPayAsYouGoFrequencyFromMap();
    return offers[productVariant][frequency];
  }
  if (!isFrequencyPrepaid(frequency) || !optedInFrequency) {
    return offers[productVariant][frequency];
  }
  return offers[productVariant][optedInFrequency];
};

const getPayAsYouGoFrequencyFromMap = () => {
  const sellingPlanElements = document.querySelectorAll(
    "span[id*=og-selling-plan-map]"
  );

  for (const sellingPlanElement of sellingPlanElements) {
    if (!sellingPlanElement.id.includes("PREPAID")) {
      const splitFrequencyKey = sellingPlanElement.id.split("-");
      return splitFrequencyKey[splitFrequencyKey.length - 1];
    }
  }
};

const getDeliveryEvery = (rootElement) => {
  return rootElement.querySelector(".og-text");
};

const getPrepaidOffer = (productVariant) => {
  const prepaidSellingPlanId = getSelectedPrepaidSellingPlanId();
  return getOffer(productVariant, getPrepaidFrequencyKey(prepaidSellingPlanId));
};

const getOffer = (productVariant, frequencyKey) => {
  return getOffers()[productVariant][frequencyKey];
};

const getOffers = () => {
  return og.store.getState().productPlans;
};

const getOptedInFrequency = (productVariant) => {
  const state = og.store.getState();
  const optedIns = state.optedin;

  const selectedOptedIn = optedIns.find(
    (optedIn) => String(optedIn.id) == String(productVariant)
  );

  return selectedOptedIn ? selectedOptedIn.frequency : null;
};

const isProductPrepaidEligible = () => !!getPrepaidCheckboxParentDiv();

const getPrepaidCheckboxesParentDiv = () => {
  return document.querySelectorAll(`.prepaid-div`);
};

const getPrepaidCheckboxParentDiv = (productVariant = null) => {
  if (!productVariant) {
    productVariant = getProductVariant();
  }

  return document.querySelector(
    `div[og-selling-plan-group-name="Prepaid-${productVariant}"]`
  );
};

const getPrepaidCheckbox = () => {
  return document.querySelector(
    `div[og-selling-plan-group-name="Prepaid-${getProductVariant()}"] input`
  );
};

const getOgOffer = () => document.querySelector(`og-offer[location="pdp"]`);

const getOgSelect = () => {
  const ogSelectedFrequency = getOgSelectedFrequency();
  if (!ogSelectedFrequency) {
    return null;
  }
  const ogSelect2 = ogSelectedFrequency.shadowRoot.querySelector("og-select");
  return ogSelect2.shadowRoot.querySelector("select");
};

const getOgSelectedFrequency = () =>
  document.querySelector("og-select-frequency");

const getOgPriceExplainer = () =>
  document.querySelector(
    `div[og-selling-plan-group-name="Prepaid-${getProductVariant()}"] .og-prepaid-selling-plan-billing-explainer`
  );

const getProductVariant = () => {
  const offer = getOgOffer();
  if (!offer) {
    return null;
  }
  return offer.getAttribute("product");
};

const getSelectedPrepaidSellingPlanId = () => {
  return getAttributeFromPrepaidOption("data-prepaid_selling_plan_id");
};

const getPrepaidTotalPrice = () => {
  return getAttributeFromPrepaidOption("data-total_prepaid_price");
};

const getPrepaidPerDeliveryPrice = () => {
  return getAttributeFromPrepaidOption("data-prepaid_price_per_delivery");
};

const getAttributeFromPrepaidOption = (attribute) => {
  const selectedPrepaidOption = getSelectedPrepaidOption();
  return selectedPrepaidOption.getAttribute(attribute);
};

const getSelectedPrepaidOption = () => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv();
  const prepaidShipmentsSelect = getPrepaidShipmentsSelect(prepaidCheckboxDiv);
  if (!prepaidShipmentsSelect) {
    return getPrepaidShipmentSpan(prepaidCheckboxDiv);
  }
  return prepaidShipmentsSelect.options[prepaidShipmentsSelect.selectedIndex];
};

const getPrepaidShipmentsSelect = (parentElement) => parentElement.querySelector(".og-prepaid-shipments-select");

const getPrepaidShipmentSpan = (parentElement) => parentElement.querySelector(".og-prepaid-shipments-span");

const inStock = (state, productVariant) =>
  (state.inStock || {})[productVariant];

const hasUpcomingOrder = (state) =>
  !!(state.nextUpcomingOrder && state.nextUpcomingOrder.public_id);

const eligibilityGroups = (state, productVariant) =>
  (state.eligibilityGroups || {})[productVariant] || null;

const hasUpsellGroup = (state, productVariant) => {
  const groups = eligibilityGroups(state, productVariant);
  return (
    groups === null ||
    !!groups.find((group) => group === "upsell" || group === "impulse_upsell")
  );
};

const upsellEligible = () => {
  const state = og.store.getState();
  const productVariant = getProductVariant();
  return (
    state.offerId &&
    state.offerId !== "0" &&
    state.auth &&
    inStock(state, productVariant) &&
    hasUpcomingOrder(state) &&
    hasUpsellGroup(state, productVariant)
  );
};

const showCheckboxCurrentVariant = () => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv();
  if (!upsellEligible() && prepaidCheckboxDiv) {
    prepaidCheckboxDiv.classList.remove("og-hidden");
  }
};

const hideCheckboxCurrentVariant = () => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv();
  if (prepaidCheckboxDiv) {
    prepaidCheckboxDiv.classList.add("og-hidden");
  }
};

const showCheckboxSpecificVariant = (productVariant) => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv(productVariant);
  if (!upsellEligible() && prepaidCheckboxDiv) {
    prepaidCheckboxDiv.classList.remove("og-hidden");
  }
};

const hideCheckboxSpecificVariant = (productVariant) => {
  const prepaidCheckboxDiv = getPrepaidCheckboxParentDiv(productVariant);
  if (prepaidCheckboxDiv) {
    prepaidCheckboxDiv.classList.add("og-hidden");
  }
};

const showPriceExplainer = () => {
  const priceExplainerElement = getOgPriceExplainer();
  if (priceExplainerElement) {
    // priceExplainerElement.classList.remove("og-hidden");
  }
};

const hidePriceExplainer = () => {
  const priceExplainerElement = getOgPriceExplainer();
  if (priceExplainerElement) {
    // priceExplainerElement.classList.add("og-hidden");
  }
};

injectPrepaidPlan();
