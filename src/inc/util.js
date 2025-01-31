/*-------------------------------------------------------------------------
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2015, wurenny@gmail.com, All rights reserved
 *
 * IDENTIFICATION
 *     inc/util.js
 *
 * This file is part of search2 project
 * util serves to options script
 *
 *-------------------------------------------------------------------------
 */

const UTIL ={};

UTIL.searchListComperator = function (json1, json2) {
  let result;
  const type1 = json1.type;
  const type2 = json2.type;
  const sno1 = json1.sno;
  const sno2 = json2.sno;
  type1 != type2 ? (result = type1 - type2) : (result = sno1 - sno2);
  return result;
};

UTIL.validateURL = function (url) {
  const strRegex =
    "^((https|http)?://)" +
    "(([0-9]{1,3}.){3}[0-9]{1,3}" +
    "|" +
    "([0-9a-z_!~*'()-]+.)*" /*ip | www*/ +
    "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." /*2th domain*/ +
    "[a-z]{2,6})" /*1th domain*/ +
    "(:[0-9]{1,4})?" /*port*/ +
    "((/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  const re = new RegExp(strRegex, "i");
  return re.test(url);
};

UTIL.getFavicon = function (img) {
  const cv = document.createElement("canvas");
  cv.width = img.offsetWidth;
  cv.height = img.offsetHeight;
  const ctx = cv.getContext("2d");
  ctx.drawImage(img, 0, 0);
  /*console.log(img.offsetWidth +"," +img.offsetHeight);*/
  return cv.toDataURL("image/x-icon");
};

UTIL.getFavicon2 = function (hostname, url) {
  const img = document
    .getElementById("foricon")
    .appendChild(document.createElement("img"));
  const cv = document.createElement("canvas");
  img.src = url;
  const txt = document.getElementById("txt");

  img.onload = function () {
    cv.width = img.offsetWidth;
    cv.height = img.offsetHeight;
    const ctx = cv.getContext("2d");
    ctx.drawImage(img, 0, 0);
    /*txt.innerHTML =txt.innerHTML +"," +hostname.replace(/\./g, "_") +" : '" +cv.toDataURL("image/x-icon").toString() +"'<br>";*/
    console.log(hostname + ": " + img.offsetWidth + "," + img.offsetHeight);
    console.log(cv.toDataURL("image/x-icon").toString());
    this.parentNode.removeChild(this);
  };
};

UTIL.onlyNumInput = function (e, minnum, maxnum) {
  let n = e.value.replace(/[^0-9]/g, "");
  n = n < minnum ? minnum : n;
  n = n > maxnum ? maxnum : n;
  e.value = n;
};


UTIL.base64encode =function(str){
	var out,i,len,base64EncodeChars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var c1,c2,c3;
	len=str.length;
	i=0;
	out="";
	while(i<len){
	    c1=str.charCodeAt(i++)&0xff;
	    if(i==len){
	        out+=base64EncodeChars.charAt(c1>>2);
	        out+=base64EncodeChars.charAt((c1&0x3)<<4);
	        out+="==";
	        break;
	    }
	    c2=str.charCodeAt(i++);
	    if(i==len){
	        out+=base64EncodeChars.charAt(c1>>2);
	        out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
	        out+=base64EncodeChars.charAt((c2&0xF)<<2);
	        out+="=";
	        break;
	    }
	    c3=str.charCodeAt(i++);
	    out+=base64EncodeChars.charAt(c1>>2);
	    out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
	    out+=base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));
	    out+=base64EncodeChars.charAt(c3&0x3F);
	}
	return out;
};

UTIL.base64decode =function(str){
	var c1,c2,c3,c4,base64DecodeChars=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);
	var i,len,out;
	len=str.length;
	i=0;
	out="";
	while(i<len){
	    /* c1 */
	    do{
	        c1=base64DecodeChars[str.charCodeAt(i++)&0xff];
	    }while(i<len&&c1==-1);
	    if(c1==-1) break;

	    /* c2 */
	    do{
	        c2=base64DecodeChars[str.charCodeAt(i++)&0xff];
	    }while(i<len&&c2==-1);
	    if(c2==-1) break;
	    out+=String.fromCharCode((c1<<2)|((c2&0x30)>>4));
	    /* c3 */
	    do{
	        c3=str.charCodeAt(i++)&0xff;
	        if(c3==61) return out;
	        c3=base64DecodeChars[c3];
	    }while(i<len&&c3==-1);
	    if(c3==-1) break;
	    out+=String.fromCharCode(((c2&0XF)<<4)|((c3&0x3C)>>2));
	    /* c4 */
	    do{
	        c4=str.charCodeAt(i++)&0xff;
	        if(c4==61) return out;
	        c4=base64DecodeChars[c4];
	    }while(i<len&&c4==-1);
	    if(c4==-1) break;
	    out+=String.fromCharCode(((c3&0x03)<<6)|c4);
	}
	return out;
};

UTIL.isJson =function(obj){
	return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
};

UTIL.json2str =function(o, br){
	var str ="";
	if(UTIL.isJson(o)){
		str +="{" +br;
		for(let oo in o){
			var ov =o[oo];
			oo =/^\d+$/.test(oo) ? oo : "'" +oo +"'";
			if(UTIL.isJson(ov)) str +=oo +":" +UTIL.json2str(ov, br);
			else if(ov instanceof Array) {
				str +=oo + ":[" +br;
				for(let i=0;i<ov.length;i++) str +=UTIL.json2str(ov[i], br);
				str +="]," +br;
			}
			else {
				ov =/^\d+$/.test(ov) ? ov : "'" +ov +"'";
				/*ov ="'" +ov +"'";*/
				str +=oo + ":" +ov +",";
			}
		}
		str +=br +"}," +br;
	}
	else if(o instanceof Array) {
		str +="[" +br;
		for(let i=0;i<o.length;i++) str +=UTIL.json2str(o[i], br);
		str +="];" +br;
	}
	else str +="'" +o + "'," +br;
	return str;
};

UTIL.option2str =function(storages,br){
	var str ="var BAKDATA ={};" +br +br;
	for(o in storages){
		if(!/^search2_\w+/.test(o)) continue;
		str +="BAKDATA." +o +" =" +UTIL.json2str(storages[o],br);
		/*str =str.replace(new RegExp("," +br +"}","g"),br +"}");*/
		str =str.replace(new RegExp("}," +br +"$"),"};" +br +br);
	}
	return str;
};

UTIL.option2jsonstr = function (storages) {
  let json = {};
  for (let o in storages) {
    if (/^search2_\w+/.test(o)) {
      json[o] = storages[o];
    }
  }
  return JSON.stringify(json);
};

UTIL.fileSaveAs = function(blob, filename) {
  const url = URL.createObjectURL(new Blob([blob], {type:'application/octet-stream'}));
  const bloba = document.createElement('a');
  bloba.href = url;
  bloba.download = filename;
  const e = document.createEvent('MouseEvents');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  bloba.dispatchEvent(e);
  URL.revokeObjectURL(url);
}


UTIL.textSave2File = async function(contents, filename, description, suffix) {
  const options = {
    suggestedName: filename,
    types: [
      {
        description: description,
        accept: {
          'text/plain': [suffix],
        },
      },
    ],
  };
  const fileHandle = await window.showSaveFilePicker(options);
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

export {UTIL};
