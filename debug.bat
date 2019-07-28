@echo off
title debug commands
start sass stylesheets/sass/default-styles.scss stylesheets/css/default-styles.css --update --watch & http-server
