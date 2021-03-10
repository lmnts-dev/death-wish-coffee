RED=$(tput setaf 1)
DEFAULT=$(tput sgr0)
YELLOW=$(tput setaf 3)

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

validate_branch () {
  eval "$(git for-each-ref --shell --format='branches+=(%(upstream:short))' refs/heads/)"

  for branch in "${branches[@]}"; do
    if [[ $branch == *"$1"* ]]; then
      echo 1
    fi
  done

  echo 0
}

is_upstream() {
  BRANCH=$(git ls-remote origin $1)
  if [[ -n "${BRANCH}" ]]; then
    echo 0
  else 
    echo 1
  fi
}

# Creates MR in Ruckus gitlab
if [ -z $1 ]; then
  echo "${YELLOW}Please provide a target branch!${DEFAULT}"
  read target

  if [[ ! -z ${target} ]]; then
    if [[ $(validate_branch ${target}) > 0 ]]; then
      MR+="-o merge_request.create -o merge_request.target=${target}"
    else
      echo "${RED}Target branch doesn't exist or the name was spelled wrong!${DEFAULT}"
      exit
    fi
  else
    echo ${RED}Please provide a target branch${DEFAULT}
    exit
  fi

  echo "${YELLOW}Remove branch after merging?(y/n)${DEFAULT}"
  read remove

  if [[ ${remove} == "yes" ]] || [[ ${remove} == "y" ]] || [[ ${remove} == "Yes" ]] || [[ ${remove} == "YES" ]]; then
    MR+=" -o merge_request.remove_source_branch"
  fi

  echo "${YELLOW}Provide a description? (optional)${DEFAULT}"
  read description

  if [[ ! -z ${description} ]]; then
    dqt='"'
    MR+=" -o merge_request.description=${dqt}/assign @jonhendershot ${description}${dqt}"
  else
    MR+=' -o merge_request.description="/assign @jonhendershot"'
  fi

  echo "${YELLOW}Provide a title? (optional)${DEFAULT}"
  read title

  if [[ ! -z ${title} ]]; then
    MR+=" -o merge_request.title='${title}'"
  fi

  eval "git push -u origin $CURRENT_BRANCH $MR"

  exit

else
  MR=''

  for (( i=1; i<=$#; i++)); do
    if [[ ${!i} == -* ]]; then
      case "${!i}" in
        -h|--help)
          echo "-t || --target\n\n\t-Is the target branch for the merge request\n"
          echo "-r || --remove\n\n\t-Will set the merge request to remove the base branch/current branch upon merge\n"
          echo "-d || --description\n\n\t-Will set the description to whatever you provide, must be wrapped in quotes\n\n\tYou may supply arguments to the description such as\n\t\t/wip (Mark request as a work in progress)\n\t\t/todo (Adds a todo)\n\t\tMore can be viewed here: https://docs.gitlab.com/ee/user/project/quick_actions.html"
          echo "--title\n\n\t-Will set the title to whatever you provide, must be wrapped in quotes\n"
          exit
          ;;
        -t|--target)
          val=$((i+1))
          if [[ ! -z ${!val} ]] && [[ ${!val} != -* ]]; then
            if [[ $(validate_branch ${!val}) > 0 ]]; then
              MR+="-o merge_request.create -o merge_request.target=${!val}"
            else
              echo "${RED}Target branch doesn't exist or the name was spelled wrong!${DEFAULT}"
              exit
            fi
          else
            echo "${RED}Bad argument supplied for target!${DEFAULT}"
            exit
          fi
          ;;
        -r|--remove)
            MR+=" -o merge_request.remove_source_branch"
          ;;
        -d|-description)
          description=1
          val=$((i+1))
          if [[ ! -z ${!val} ]] && [[ ${!val} != -* ]]; then
            dqt='"'
            MR+=" -o merge_request.description=${dqt}/assign @jonhendershot ${!val}${dqt}"
          else
            echo "${RED}Bad argument supplied for description!${DEFAULT}"
            exit
          fi
          ;;
        --title)
          val=$((i+1))
          if [[ ! -z ${!val} ]] && [[ ${!val} != -* ]]; then
            MR+=" -o merge_request.title='${!val}'"
          else
            echo "${RED}Bad argument supplied for title!${DEFAULT}"
            exit
          fi
          ;;
      esac
    fi
  done

  if [[ $(is_upstream $CURRENT_BRANCH) > 0 ]]; then
    if [[ -z $description ]]; then
      MR+=' -o merge_request.description="/assign @jonhendershot"'
      eval "git push -u origin $CURRENT_BRANCH $MR"
    else
      eval "git push -u origin $CURRENT_BRANCH $MR"
    fi
  else
    if [[ -z $description ]]; then
      MR+=' -o merge_request.description="/assign @jonhendershot"'
      eval "git push $MR"
    else
      eval "git push $MR"
    fi
  fi
fi

exit
