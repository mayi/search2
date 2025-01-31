/*-------------------------------------------------------------------------
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2015, wurenny@gmail.com, All rights reserved
 *
 * Modified by: mayi@live.com 2023-04
 *
 * IDENTIFICATION
 *     bg/service_worker.js
 *
 * This file is part of search2 project
 * evtpage works when search2's context menu trigged
 *
 *-------------------------------------------------------------------------
 */
import { IDATA } from "/opt/init-data.js";

const EVPG = {};
let favlist;
let cmstate;

EVPG.msgLsnr = function () {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action == "search2createcm") {
      EVPG.createCM();
      return true;
    }
    if (request.action == "search2initcm") {
      EVPG.initCM();
      return true;
    }
    if (request.action == "search2encodekw") {
      EVPG.encodeURL(sendResponse, request.enc, request.kw).submit();
      return true;
    } else {
      sendResponse({});
    }
  });
};

EVPG.createCM = function () {
  chrome.storage.local.get(function (storages) {
    let config = storages.search2_config || IDATA.search2_config;
    if (!config.cmenu) {
      chrome.contextMenus.removeAll();
      return;
    }
    favlist = storages.search2_favlist || IDATA.search2_favlist;
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
      title: "Search2",
      id: "search2cmenu",
      contexts: ["all"],
    });

    for (const element of favlist) {
      if (element.on != 1 || !element.cm || element.cm != 1) continue;
      let ctxtype;
      if (element.url.indexOf("%p") != -1) {
        ctxtype = "image";
      } else {
        ctxtype = "selection";
      }
      chrome.contextMenus.create({
        title: element.name,
        id: "search2cmenu_" + ctxtype + "_" + element.type + "_" + element.sno,
        parentId: "search2cmenu",
        contexts: [ctxtype],
      });
    }
  });
};

EVPG.initCM = function () {
  if (cmstate) {
    return;
  }
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    let url,
      params = info.menuItemId.split("_");
    let esckw, kw;
    if (info.menuItemId == "search2cmenu") {
      chrome.tabs.sendMessage(tab.id, { action: "search2popmore" });
    } else {
      if (params[0] == "search2cmenu" && params[1] == "image") {
        esckw = "%p";
        if (info.srcUrl.substr(0, 4) == "http") {
          kw = info.srcUrl;
        }
      } else if (params[0] == "search2cmenu" && params[1] == "selection") {
        esckw = "%s";
        kw = info.selectionText.replace(/\n/g, " ").trim().substr(0, 64);
      }
      if (!kw || kw == "") return;
      for (const element of favlist) {
        if (
          element.cm == 1 &&
          element.type == parseInt(params[2]) &&
          element.sno == parseInt(params[3]) &&
          element.on == 1
        ) {
          if (!element.enc) {
            url = element.url.replace(esckw, kw);
            if (url) {
              chrome.tabs.create({
                url: url,
              });
            }
          } else {
            EVPG.encodeURL(
              function (response) {
                url = element.url.replace(esckw, response.enckw);
                if (url) {
                  chrome.tabs.create({
                    url: url,
                  });
                }
              },
              element.enc,
              kw
            ).submit();
          }
          break;
        }
      }
    }
  });
  cmstate = 1;
};

EVPG.encodeURL = function (cb, charset, str) {
  const iframeId = "search2enc_iframe",
    formId = "search2enc_form",
    inputName = "search2enc_input";

  let iframe = document.getElementById(iframeId);
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = iframeId;
    iframe.name = iframeId;
    iframe.src = "/oth/blank.html";
    iframe.style.display = "none";
    document.documentElement.appendChild(iframe);
  }

  iframe.onload = function () {
    const enckw = iframe.contentWindow.location.search.split("=")[1];
    cb({ enckw: enckw });
    document.documentElement.removeChild(iframe);
    document.documentElement.removeChild(form);
  };

  let form = document.getElementById(formId);
  if (form) {
    document.getElementById("search2enc_textinput").value = str;
    return form;
  }
  form = document.createElement("form");
  form.acceptCharset = charset;
  form.id = formId;
  form.method = "get";
  form.target = iframeId;
  form.style.display = "none";
  const input = document.createElement("input");
  input.id = "search2enc_textinput";
  input.type = "hidden";
  input.name = inputName;
  input.value = str;
  form.appendChild(input);
  document.documentElement.appendChild(form);

  return form;
};

EVPG.main = function () {
  EVPG.msgLsnr();
  EVPG.createCM();
};

EVPG.main();
