#!/bin/bash

# Contains functions dedicated to the containerization config parsing that are used by containerization_functions.sh

POLLITI_CONTAINERIZATION_CONFIG="${PWD}/containerization_config.yml"
POLLITI_CONTAINERIZATION_CONFIG_PARSED=0
POLLITI_CONTAINERIZATION_CONFIG_PREFIX="POLLITI_CONTAINERIZATION_"
BACKEND_CONTAINERIZATION_CONFIG_PARAMETERS=(
    "AGENCY_NAME"
    "POLLITI_PUBLIC_ORIGIN"
    "MAX_LOGIN_ATTEMPTS_PER_IP"
    "LOGIN_ATTEMPTS_HOURS_BEFORE_RESET"
    "PAGE_TOKEN"
    "PAGE_ID"
    "SMTP_HOST"
    "SMTP_USERNAME"
    "SMTP_PASSWORD"
    "SMTP_PORT"
    "ENABLE_STARTTLS"
    "DB_USER_PASSWORD"
)
FRONTEND_CONTAINERIZATION_CONFIG_PARAMETERS=(
    "AGENCY_NAME"
)

function parse_yaml {
    local prefix=$2
    local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
    sed -ne "s|^\($s\):|\1|" \
        -e 's|`||g;s|\$||g;' \
        -e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
    awk -F$fs '{
        indent = length($1)/2;
        vname[indent] = $2;
        for (i in vname) {if (i > indent) {delete vname[i]}}
        if (length($3) > 0) {
            vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
            printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
        }
    }'
}

function parse_containerization_yaml_config {
    if [ "${POLLITI_CONTAINERIZATION_CONFIG_PARSED}" == "1" ]; then
        return 1
    fi

    echo "Parsing containerization configuration file ${POLLITI_CONTAINERIZATION_CONFIG}..."
    # eval the parse_yaml result so that all variables are exported as ones in the shell
    eval $(parse_yaml "${POLLITI_CONTAINERIZATION_CONFIG}" "${POLLITI_CONTAINERIZATION_CONFIG_PREFIX}")

    POLLITI_CONTAINERIZATION_CONFIG_PARSED=1
    echo -e "...DONE.\n"
    return 1
}

function check_containerization_parameters {
    local specific_containerization_config_parameters=("$@") # the frontend or the backend ones
    local parse_checks_successful=1

    for config_variable in "${specific_containerization_config_parameters[@]}"
    do
        local config_variable_value=$(eval "echo \${${POLLITI_CONTAINERIZATION_CONFIG_PREFIX}${config_variable}}")
        if [ -z "${config_variable_value}" ]; then
            echo "${config_variable} is not defined"
            if [ "${parse_checks_successful}" == "1" ]; then
                parse_checks_successful=0
            fi
        fi
    done

    if [ "${parse_checks_successful}" == "0" ]; then
        echo "...FATAL: One or more required properties are not defined in the containerization configuration file ${POLLITI_CONTAINERIZATION_CONFIG}"
        exit 1
    fi

    echo -e "...DONE.\n"
    return 1
}

function check_containerization_specific_config_parameters {
    local container_name="$1"

    echo "Checking if all required containerization configuration properties for container ${container_name} are set in ${POLLITI_CONTAINERIZATION_CONFIG}..."
    case "${container_name}" in
        "${POLLITI_BACKEND_CONTAINER_NAME}")
            check_containerization_parameters "${BACKEND_CONTAINERIZATION_CONFIG_PARAMETERS[@]}"
            ;;
        "${POLLITI_FRONTEND_CONTAINER_NAME}")
            check_containerization_parameters "${FRONTEND_CONTAINERIZATION_CONFIG_PARAMETERS[@]}"
            ;;
        *)
            echo "...FATAL: Unknown container name: ${container_name}"
            exit 1
            ;;
    esac
    return 1
}