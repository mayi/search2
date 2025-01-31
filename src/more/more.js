/*-------------------------------------------------------------------------
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2015, wurenny@gmail.com, All rights reserved
 *
 * IDENTIFICATION
 *     more/more.js
 *
 * This file is part of search2 project
 * more.js sets dynamic url links for all table cells in more color box
 *
 *-------------------------------------------------------------------------
 */

var initI18n = function () {
  document.getElementById("__more_autoclose").innerText =
    chrome.i18n.getMessage("more_autoclose");
  document.getElementById("__more_newwindow").innerText =
    chrome.i18n.getMessage("more_newwindow");
  document.getElementById("search2_more_remember").innerText =
    chrome.i18n.getMessage("more_remember");
};

window.onload = function () {
  /**
	chrome.extension.sendRequest(
		{action: "getkw"},
		function(response){
			var kw =response.utfkw;

		}
	);
	**/
  var kw = document.location.search.substr(4);
  if (!kw) kw = "";

  Array.prototype.containOf = function (e) {
    if (this.constructor != Array) return;
    for (let i = 0; i < this.length; i++) if (e == this[i]) return true;
    return false;
  };

  var searchInput = document.getElementById("search2_more_searchInput");
  searchInput.value = decodeURIComponent(kw);
  initI18n();

  chrome.storage.local.get(function (storages) {
    var favtypes = storages.search2_favtypes;
    var favlist = storages.search2_favlist;
    var icondatas = storages.search2_icondatas;
    var nohslist = storages.search2_nohslist;

    if (!favtypes) favtypes = IDATA.search2_favtypes;
    if (!favlist) favlist = IDATA.search2_favlist;
    if (!icondatas) icondatas = IDATA.search2_icondatas;
    if (!nohslist) nohslist = IDATA.search2_nohslist;

    /*config */
    chrome.extension.sendRequest({ action: "xCorlorBox" }, function (rep) {
      console.log(rep.overlay);
    });

    var morelist = document.getElementById("search2_more_morelist");
    var trs = [];
    //tr
    for (let tp in favtypes) {
      trs[tp] = morelist.appendChild(document.createElement("tr"));
    }
    //td
    for (let i = 0; i < favlist.length; i++) {
      if (!favlist[i].on) continue;
      var td = trs[favlist[i].type].appendChild(document.createElement("td"));
      var searchItem = td.appendChild(document.createElement("a"));
      searchItem.title = favlist[i].name;
      td.setAttribute("host", favlist[i].host);
      td.setAttribute("url", favlist[i].url);
      searchItemImg = searchItem.appendChild(document.createElement("img"));
      searchItemImg.src = icondatas[favlist[i].icon];
      searchItemText = searchItem.appendChild(document.createElement("span"));
      searchItemText.innerText = favlist[i].name;

      td.onclick = function () {
        var target = document.getElementById("search2_more_newwindow").checked
          ? "_blank"
          : "_top";
        var utfkeywords = encodeURIComponent(searchInput.value);
        var utfkeywords_nhs = utfkeywords
          .replace(/\%(26|2B|2d|2E)/g, "%25$1")
          .replace(/-/g, "%252d")
          .replace(/\./g, "%252E");
        //console.log(utfkeywords);
        //console.log(utfkeywords_nhs);
        var host = this.getAttribute("host");
        var url = this.getAttribute("url");
        var url = url.replace(
          "%s",
          nohslist.containOf(host) ? utfkeywords_nhs : utfkeywords
        );
        //console.log(url);
        window.open(url, target);
      };
    }
  });
};
