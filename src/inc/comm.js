/*-------------------------------------------------------------------------
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2015, wurenny@gmail.com, All rights reserved
 *
 * IDENTIFICATION
 *     inc/comm.js
 *
 * This file is part of search2 project
 * comm is the commonly used for any other invoker, including some prototype
 * functions and small tools
 *
 *-------------------------------------------------------------------------
 */

const COM = {};

COM.chromeCompatible = function () {
  const chromeVersion = navigator.userAgent
    .toLowerCase()
    .match(/chrome\/(\d+)/);
  return (
    typeof chrome == "object" &&
    typeof chrome.extension == "object" &&
    chromeVersion.length > 1 &&
    chromeVersion[1] >= 21
  );
};

COM.getTypeName = function (type) {
  switch (type) {
    case 0:
      return i18n.__com_typename_news;
    case 1:
      return i18n.__com_typename_web;
    case 2:
      return i18n.__com_typename_picture;
    case 3:
      return i18n.__com_typename_video;
    case 4:
      return i18n.__com_typename_music;
    case 5:
      return i18n.__com_typename_shopping;
  }
};

COM.decodeURL = function (cb, charset, str) {
  var script = document.documentElement.appendChild(
    document.createElement("script")
  );
  var div = document.documentElement.appendChild(document.createElement("div"));
  script.id = "search2kwscript";
  div.id = "search2kwdiv";
  div.style.display = "none";
  script.onload = cb;
  var src = "data:text/javascript;charset=" + charset + ",";
  src += "document.getElementById('search2kwdiv').innerText='" + str + "';";
  src +=
    'document.getElementById("search2kwscript").parentNode.removeChild(document.getElementById("search2kwscript"));';
  script.src = src;
};

COM.removeObjdata = function () {
  if (document.location.host.indexOf("bing.com") == -1) return;
  var objs = document.getElementsByTagName("object");
  if (!objs) return;
  for (var i = 0; i < objs.length; i++) {
    if (objs[i].getAttribute("data")) objs[i].removeAttribute("data");
  }
};

COM.getContrastColor = function (color, factor) {
  const HX = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  let n,
    rcolor = ["#", "#", "#"];
  for (let i = 1; i < 7; i++) {
    n = color.substr(i, 1);
    n = parseInt("0x" + (n ? n : i));
    n = (n + factor * i) % 16;
    rcolor[0] += HX[n];
    rcolor[1] += HX[n + 2 > 15 ? 15 : n + 2];
    rcolor[2] += HX[n + 4 > 15 ? 15 : n + 4];
  }
  return rcolor;
};

COM.getSelectedText = function () {
  return (selectedtext = window
    .getSelection()
    .toString()
    .replace(/\n/g, " ")
    .trim()
    .substr(0, 64));
};
