# cloudcms-tmobile
Cloud CMS engagement artifacts for cloudcms-tmobile project

## install content model
    1. create gitana.json file
    2. cd content-model
    3. edit deploy-content-model
        ensure the correct gitana.json file for the target environment is referenced
    4. run the shell script: 
        ./deploy-content-model

## import content using custom importer

    ### (one time setup) Install and initialize the npm "cloudcms-cli" module:
        1. npm install -g cloudcms-cli
        2. cloudcms init

    ### import data:
        1. cd ./importer
        2. Set a repository id and a branch id in deploy-data.sh
        3. run the shell script: ./deploy-data.sh

## install ui-module
    This Module implements the customizations to the Cloud CMS UI or Alpaca form fields.

    From Manage Platform / Modules register and deploy a new module:
    ID: tmobile-module
    Title: tmobile-module
    Type: github
    URL: https://github.com/harrymoore/cloudcms-tmobile
    Path: /modules/ui
    Branch: master
