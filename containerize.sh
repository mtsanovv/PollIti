#!/bin/bash

# This is PollIti containerization driver script, it only calls functions from the containerization_functions.sh file

POLLITI_CONTAINERIZATION_FUNCTIONS="${PWD}/container/containerization_functions.sh"
POLLITI_CONTAINERIZATION_CONFIG="${PWD}/containerization_config.yml"

if [ ! -f "${POLLITI_CONTAINERIZATION_FUNCTIONS}" ]; then
    echo "FATAL: Auxiliary file ${POLLITI_CONTAINERIZATION_FUNCTIONS} not found, has it been deleted?"
    exit 1
fi

source "${POLLITI_CONTAINERIZATION_FUNCTIONS}"

print_header

if [ ! -f "${POLLITI_CONTAINERIZATION_CONFIG}" ]; then
    echo "FATAL: Containerization configuration file ${POLLITI_CONTAINERIZATION_CONFIG} does not exist - create it in ${PWD}"
    exit 1
fi

check_podman
create_volumes_sources

exit 0