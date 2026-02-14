//--------------------------------------------------------------------------------
//	Copyright 2010-2011 Sitoo AB
//--------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//	Constants
//-------------------------------------------------------------------------------
	var g_strSdBoUrl			= "http://www.ribegatan.se/admin/";
	var g_strSdExt				= ".php";
	var g_strSdLangId			= "sv";
	var g_strSdServiceUrl		= "sd_admin_services" + g_strSdExt;
	var g_strSdServiceUrlAbs	= g_strSdBoUrl + g_strSdServiceUrl;
//-------------------------------------------------------------------------------

if(typeof(g_sd_admin_client_strings) != "object") { g_sd_admin_client_strings = { s: function(o) { return o; } } }

function md5(strValue) {

    function Utf8Encode(strValue) {
        strValue = strValue.replace(/\r\n/g,"\n");
        var utftext = "";

        for(var n = 0; n < strValue.length; n++) {
            var c = strValue.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    };

    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32-iShiftBits));
    }
	
	function AddUnsigned(lX,lY) {
	    var lX8 = (lX & 0x80000000);
	    var lY8 = (lY & 0x80000000);
	    var lX4 = (lX & 0x40000000);
	    var lY4 = (lY & 0x40000000);
	    var lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
	    if (lX4 & lY4) {
	        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
	    }
	    if (lX4 | lY4) {
	        if (lResult & 0x40000000) {
	            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
	        } else {
	            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
	        }
	    } else {
	        return (lResult ^ lX8 ^ lY8);
	    }
	 }

	function F(x, y, z) { return (x & y) | ((~x) & z); }
	function G(x, y, z) { return (x & z) | (y & (~z)); }
	function H(x, y, z) { return (x ^ y ^ z); }
	function I(x, y, z) { return (y ^ (x | (~z))); }
	
    function Md5FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function Md5GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function Md5HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function Md5II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(strValue) {
        var lWordCount;
        var lMessageLength = strValue.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while(lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (strValue.charCodeAt(lByteCount) << lBytePosition));
            ++lByteCount;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var hexValue = "";
        for (var n = 0; n <= 3; ++n) {
            var lByte = (lValue >>> (n * 8)) & 255;
            var temp = "0" + lByte.toString(16);
            hexValue = hexValue + temp.substr(temp.length - 2, 2);
        }
        return hexValue;
    };

    strValue = Utf8Encode(strValue);

    var array = ConvertToWordArray(strValue);

	// Init chaining variables...
	var a = 0x67452301;
	var b = 0xefcdab89;
	var c = 0x98badcfe;
	var d = 0x10325476;

    for (var n = 0; n < array.length; n += 16) {
        var AA = a; 
        var BB = b; 
        var CC = c; 
        var DD = d;
       	
       	//	Round 1...
        a = Md5FF(a, b, c, d, array[n + 0], 	7,	0xd76aa478);
        d = Md5FF(d, a, b, c, array[n + 1], 	12,	0xe8c7b756);
        c = Md5FF(c, d, a, b, array[n + 2], 	17,	0x242070db);
        b = Md5FF(b, c, d, a, array[n + 3], 	22,	0xc1bdceee);
        a = Md5FF(a, b, c, d, array[n + 4], 	7,	0xf57c0faf);
        d = Md5FF(d, a, b, c, array[n + 5], 	12,	0x4787c62a);
        c = Md5FF(c, d, a, b, array[n + 6], 	17,	0xa8304613);
        b = Md5FF(b, c, d, a, array[n + 7], 	22,	0xfd469501);
        a = Md5FF(a, b, c, d, array[n + 8], 	7,	0x698098d8);
        d = Md5FF(d, a, b, c, array[n + 9], 	12,	0x8b44f7af);
        c = Md5FF(c, d, a, b, array[n + 10],	17,	0xffff5bb1);
        b = Md5FF(b, c, d, a, array[n + 11],	22,	0x895cd7be);
        a = Md5FF(a, b, c, d, array[n + 12],	7,	0x6b901122);
        d = Md5FF(d, a, b, c, array[n + 13],	12,	0xfd987193);
        c = Md5FF(c, d, a, b, array[n + 14],	17,	0xa679438e);
        b = Md5FF(b, c, d, a, array[n + 15],	22,	0x49b40821);

		//	Round 2...
        a = Md5GG(a, b, c, d, array[n + 1], 	5,	0xf61e2562);
        d = Md5GG(d, a, b, c, array[n + 6], 	9,	0xc040b340);
        c = Md5GG(c, d, a, b, array[n + 11],	14,	0x265e5a51);
        b = Md5GG(b, c, d, a, array[n + 0], 	20,	0xe9b6c7aa);
        a = Md5GG(a, b, c, d, array[n + 5], 	5,	0xd62f105d);
        d = Md5GG(d, a, b, c, array[n + 10],	9,	0x2441453);
        c = Md5GG(c, d, a, b, array[n + 15],	14,	0xd8a1e681);
        b = Md5GG(b, c, d, a, array[n + 4], 	20,	0xe7d3fbc8);
        a = Md5GG(a, b, c, d, array[n + 9], 	5,	0x21e1cde6);
        d = Md5GG(d, a, b, c, array[n + 14],	9,	0xc33707d6);
        c = Md5GG(c, d, a, b, array[n + 3], 	14,	0xf4d50d87);
        b = Md5GG(b, c, d, a, array[n + 8], 	20,	0x455a14ed);
        a = Md5GG(a, b, c, d, array[n + 13],	5,	0xa9e3e905);
        d = Md5GG(d, a, b, c, array[n + 2], 	9,	0xfcefa3f8);
        c = Md5GG(c, d, a, b, array[n + 7], 	14,	0x676f02d9);
        b = Md5GG(b, c, d, a, array[n + 12],	20,	0x8d2a4c8a);
 
	  	//	Round 3...
        a = Md5HH(a, b, c, d, array[n + 5], 	4,	0xfffa3942);
        d = Md5HH(d, a, b, c, array[n + 8], 	11,	0x8771f681);
        c = Md5HH(c, d, a, b, array[n + 11],	16,	0x6d9d6122);
        b = Md5HH(b, c, d, a, array[n + 14],	23,	0xfde5380c);
        a = Md5HH(a, b, c, d, array[n + 1], 	4,	0xa4beea44);
        d = Md5HH(d, a, b, c, array[n + 4], 	11,	0x4bdecfa9);
        c = Md5HH(c, d, a, b, array[n + 7], 	16,	0xf6bb4b60);
        b = Md5HH(b, c, d, a, array[n + 10],	23,	0xbebfbc70);
        a = Md5HH(a, b, c, d, array[n + 13],	4,	0x289b7ec6);
        d = Md5HH(d, a, b, c, array[n + 0], 	11,	0xeaa127fa);
        c = Md5HH(c, d, a, b, array[n + 3], 	16,	0xd4ef3085);
        b = Md5HH(b, c, d, a, array[n + 6], 	23,	0x4881d05);
        a = Md5HH(a, b, c, d, array[n + 9], 	4,	0xd9d4d039);
        d = Md5HH(d, a, b, c, array[n + 12],	11,	0xe6db99e5);
        c = Md5HH(c, d, a, b, array[n + 15],	16,	0x1fa27cf8);
        b = Md5HH(b, c, d, a, array[n + 2], 	23,	0xc4ac5665);
        
	  	//	Round 4...
        a = Md5II(a, b, c, d, array[n + 0], 	6,	0xf4292244);
        d = Md5II(d, a, b, c, array[n + 7], 	10,	0x432aff97);
        c = Md5II(c, d, a, b, array[n + 14],	15,	0xab9423a7);
        b = Md5II(b, c, d, a, array[n + 5], 	21,	0xfc93a039);
        a = Md5II(a, b, c, d, array[n + 12],	6,	0x655b59c3);
        d = Md5II(d, a, b, c, array[n + 3], 	10,	0x8f0ccc92);
        c = Md5II(c, d, a, b, array[n + 10],	15,	0xffeff47d);
        b = Md5II(b, c, d, a, array[n + 1], 	21,	0x85845dd1);
        a = Md5II(a, b, c, d, array[n + 8], 	6,	0x6fa87e4f);
        d = Md5II(d, a, b, c, array[n + 15],	10,	0xfe2ce6e0);
        c = Md5II(c, d, a, b, array[n + 6], 	15,	0xa3014314);
        b = Md5II(b, c, d, a, array[n + 13],	21,	0x4e0811a1);
        a = Md5II(a, b, c, d, array[n + 4], 	6,	0xf7537e82);
        d = Md5II(d, a, b, c, array[n + 11],	10,	0xbd3af235);
        c = Md5II(c, d, a, b, array[n + 2], 	15,	0x2ad7d2bb);
        b = Md5II(b, c, d, a, array[n + 9], 	21,	0xeb86d391);
        
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    var ret = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return ret.toLowerCase();
}

function SDApplication(strPackageId, strPackageName, nVersion, bInstalled, bHasLicense, bActive, strDateExpires, bTrial, bAutoVoucher, strLabel, strIconSrc, strTitle, strDescription, strLinkBo, strLinkBase, nSortOrder, bNewVersionExists, nMaxNumUsers, nCurNumUsers)
{
	if(!(objESCF instanceof ESCF)) objESCF = new ESCF();

	this.m_strPackageId			= strPackageId;
	this.m_strPackageName		= strPackageName;
	this.m_nVersion				= nVersion;
	this.m_bInstalled			= bInstalled;

	this.m_bHasLicense			= bHasLicense;
	this.m_bActive				= bActive;
	this.m_dateExpires			= objESCF.CreateDateFromInternalFormatString(strDateExpires);
	this.m_bTrial				= bTrial;
	this.m_bAutoVoucher			= bAutoVoucher;
	this.m_strLabel				= strLabel;

	this.m_strIconSrc			= strIconSrc;
	this.m_strTitle				= strTitle;
	this.m_strDescription		= strDescription;

	this.m_strLinkBo			= strLinkBo;
	this.m_strLinkBase			= strLinkBase;

	this.m_nSortOrder			= nSortOrder;
	this.m_bNewVersionExists	= typeof(bNewVersionExists) == "boolean" ? bNewVersionExists : false;
	
	this.m_nMaxNumUsers			= typeof(nMaxNumUsers) == "number" && nMaxNumUsers >= 0 ? nMaxNumUsers : null;
	this.m_nCurNumUsers			= typeof(nCurNumUsers) == "number" && nCurNumUsers > 0 ? nCurNumUsers : null;

	// strType: i, u, a, r, b (install, uninstall, activate, read more, buy)
	this.GetUrl = function(strType)
	{
		if(!(objLibrary instanceof SDLibrary) || this.m_strLinkBase == "" || this.m_strPackageId == "" || this.m_strPackageName == "") return "";
		return this.m_strLinkBase + "?cmd=sd_asevent" + (objLibrary.m_strLangId2.length == 2 ? "&lang=" + encodeURIComponent(objLibrary.m_strLangId2) : "") + "&t=" + encodeURIComponent(strType) + "&pi=" + encodeURIComponent(this.m_strPackageId) + "&p=" + encodeURIComponent(this.m_strPackageName) + "&su=" + encodeURIComponent(objLibrary.m_strSiteUrl) + ""
	}
	
	this.GetUrlSolved = function(strType)
	{
		switch(strType) {
			case "i":
				{
					if(!(objLibrary instanceof SDLibrary) || !objLibrary.CheckOkToInstall(this.m_strPackageId)) return "";
					if(this.m_bHasLicense) {
						if(!this.m_bActive || this.GetNumDaysLeft() == 0) return "";
						return this.GetUrl("i");
					}
					if(this.m_bAutoVoucher) return this.GetUrl("i");
				}
				break;
			case "u": if(this.m_bInstalled) return this.GetUrl("u");																			break;
			case "a": if(this.m_bTrial) return this.GetUrl("a");																				break;
			case "r": return this.GetUrl("r");
			case "b": if(this.m_bHasLicense ? this.m_bTrial : this.m_bTrial || !this.m_bAutoVoucher) return this.GetUrl("b");					break;
		}
		return "";
	}
	
	this.GetNumDaysLeft = function(dateNow)
	{
		if(!(dateNow instanceof Date)) dateNow = objLibrary.dateNow;
		if(!(this.m_dateExpires instanceof Date) || !(dateNow instanceof Date)) return -1;
		
		var nMsInDay = 1000 * 60 * 60 * 24;

		var date1 = new Date(this.m_dateExpires);
		var date2 = new Date(dateNow);
		date1.setHours(0, 0, 0, 0);
		date2.setHours(0, 0, 0, 0);

		var nMs1 = date1.getTime();
		var nMs2 = date2.getTime();
		
		var nMsDiff = nMs1 - nMs2;
		var nDaysLeft = Math.round(nMsDiff / nMsInDay)
		
		if(nDaysLeft < 0) nDaysLeft = 0;
		
		return nDaysLeft;
	}
}

function SDAppConstraints()
{
	this.m_arrNot	= [];
	this.m_arrOr	= [];
	this.m_arrAnd	= [];
	this.AddNot		= function(strPackageId) { this.m_arrNot.push(strPackageId); }
	this.AddOr		= function(strPackageId) { this.m_arrOr.push(strPackageId); }
	this.AddAnd		= function(strPackageId) { this.m_arrAnd.push(strPackageId); }
}

function SDLibrary(strServiceUrl, strSiteUrl, strDateNow, strLangId2)
{
	if(!(objESCF instanceof ESCF)) objESCF = new ESCF();

	this.m_strServiceUrl		= strServiceUrl;
	this.m_strSiteUrl			= strSiteUrl;
	this.dateNow				= objESCF.CreateDateFromInternalFormatString(strDateNow)
	this.m_strLangId2			= (typeof(strLangId2) == "string" && strLangId2.length == 2 ? strLangId2 : g_strSdLangId);
	this.m_strUiInstall			= "";
	this.m_strUiUninstall		= "";
	this.m_strUiActivate		= "";
	this.m_strUiReadMore		= "";
	this.m_strUiBuy				= "";
	this.m_strUiNoConnection	= "";
	this.m_arrApps				= new Array();
	this.m_nCount				= 1;
	this.m_objConstraints		= {};	// this.m_objConstraints[****-****] = SDAppConstraints

	this.GetUiString = function(strType)
	{
		switch(strType) {
			case "i": return this.m_strUiInstall;
			case "u": return this.m_strUiUninstall;
			case "a": return this.m_strUiActivate;
			case "r": return this.m_strUiReadMore;
			case "b": return this.m_strUiBuy;
		}
		return "";
	}

	this.Add = function(strPackageId, strPackageName, nVersion, bActive, strDateExpires, bTrial, bAutoVoucher, strIconSrc, strTitle, strDescription, strLinkBo, strLinkBase, nMaxNumUsers, nCurNumUsers)
	{
		this.m_arrApps.push(new SDApplication(strPackageId, strPackageName, nVersion, true, true, bActive, strDateExpires, bTrial, bAutoVoucher, "", strIconSrc, strTitle, strDescription, strLinkBo, strLinkBase, ++this.m_nCount, false, nMaxNumUsers, nCurNumUsers));
	}

	this.Append = function(strPackageId, strPackageName, nVersion, bHasLicense, bActive, strDateExpires, bTrial, bAutoVoucher, strLabel, strIconSrc, strTitle, strDescription, strLinkBo, strLinkBase, nSortOrder, nMaxNumUsers)
	{
		if(typeof(this.m_strServiceUrl) == "string" && this.m_strServiceUrl.length > 0 && objESCF.IsAjaxEnabled()) {
			var strQuery = "?type=admin&cmd=updatepackage";
			strQuery += "&packageid="	+ encodeURIComponent(strPackageId);
			strQuery += "&active="		+ (bActive ? "true" : "false");
			strQuery += "&dateexpires=" + encodeURIComponent(strDateExpires);
			strQuery += "&trial="		+ (bTrial ? "true" : "false");
			strQuery += "&linkbase="	+ encodeURIComponent(strLinkBase);
			strQuery += "&sortorder="	+ nSortOrder;
			strQuery += "&maxnumusers="	+ nMaxNumUsers;
			objESCF.DoRequest("GET", this.m_strServiceUrl + strQuery, "");
		}
	
		var objApp = null;
		for(var i = 0; i < this.m_arrApps.length; ++i) {
			if(strPackageId == this.m_arrApps[i].m_strPackageId) {
				objApp = this.m_arrApps[i];
				break;
			}
		}
		if(objApp != null) {
			// Update from lv
			objApp.m_bActive		= bActive;
			objApp.m_dateExpires	= objESCF.CreateDateFromInternalFormatString(strDateExpires);
			objApp.m_bTrial			= bTrial;
			objApp.m_nSortOrder		= nSortOrder;
			objApp.m_strLinkBase	= strLinkBase;
			objApp.m_nMaxNumUsers	= nMaxNumUsers;

			if(!objApp.m_bActive && typeof(objApp.m_strLinkBo) == "string" && objApp.m_strLinkBo.length > 0) {
				objApp.m_strLinkBo = objApp.GetUrl("r");
			}
			if(objApp.m_nVersion < nVersion) {
				objApp.m_bNewVersionExists = true;
			}

		} else {
			this.m_arrApps.push(new SDApplication(strPackageId, strPackageName, nVersion, false, bHasLicense, bActive, strDateExpires, bTrial, bAutoVoucher, strLabel, strIconSrc, strTitle, strDescription, strLinkBo, strLinkBase, nSortOrder, false, nMaxNumUsers));
		}
	}

	this.GetApplication = function(strPackageId)
	{
		for(var i = 0; i < this.m_arrApps.length; ++i) {
			if(strPackageId == this.m_arrApps[i].m_strPackageId) {
				return this.m_arrApps[i];
			}
		}
		return null;
	}
	
	this.GetApplications = function(bInstalled)
	{
		var arr = new Array();
		for(var i = 0; i < this.m_arrApps.length; ++i) {
			if(bInstalled == this.m_arrApps[i].m_bInstalled) {
				arr.push(this.m_arrApps[i]);
			}
		}
		arr.sort(function(o1, o2) { return o1.m_nSortOrder < o2.m_nSortOrder ? -1 : (o1.m_nSortOrder == o2.m_nSortOrder ? (o1.m_strTitle < o2.m_strTitle ? -1 : (o1.m_strTitle == o2.m_strTitle ? 0 : 1)) : 1) });
		return arr;
	}

	this.CheckOkToInstall = function(strPackageId)
	{
		var objConstraints = this.m_objConstraints[strPackageId];
		if(!(objConstraints instanceof SDAppConstraints)) return true;

		for(var i = 0; i < objConstraints.m_arrNot.length; ++i) {
			if(this.GetApplication(objConstraints.m_arrNot[i]).m_bInstalled) return false;
		}

		for(var i = 0; i < objConstraints.m_arrAnd.length; ++i) {
			if(!this.GetApplication(objConstraints.m_arrAnd[i]).m_bInstalled) return false;
		}
		if(objConstraints.m_arrOr.length == 0) return true;

		for(var i = 0; i < objConstraints.m_arrOr.length; ++i) {
			if(this.GetApplication(objConstraints.m_arrOr[i]).m_bInstalled) return true;
		}
		return false;
	}
}

function SDQuoteForJs(str)
{
	str += "";
	str = str.replace(/\\/g, "\\\\");
	str = str.replace(/\r/g, "");
	str = str.replace(/\n/g, "\\r\\n");
	str = str.replace(/\"/g, "\\\"");
	str = str.replace(/\'/g, "\\\'");
	return str;
}

var NODE_ELEMENT				= 1;
var NODE_ATTRIBUTE				= 2;
var NODE_TEXT					= 3;
var NODE_CDATA_SECTION			= 4;
var NODE_ENTITY_REFERENCE		= 5;
var NODE_ENTITY					= 6;
var NODE_PROCESSING_INSTRUCTION	= 7;
var NODE_COMMENT				= 8;
var NODE_DOCUMENT				= 9;
var NODE_DOCUMENT_TYPE			= 10;
var NODE_DOCUMENT_FRAGMENT		= 11;
var NODE_NOTATION				= 12;

function ESCFNode(objXMLNode)
{
	this.CheckXMLNode = function(objNode)
	{
		var bOK = false;
		try {
			if(objNode != null && typeof(objNode) != "undefined" && objNode.nodeType != null && typeof(objNode.nodeType) != "undefined" && !(isNaN(objNode.nodeType))) bOK = true;
		} catch(e) { bOK = false; }
		return bOK;	
	}

	this.GetName = function()
	{
		if(!this.CheckXMLNode(objXMLNode)) return "";
		return objXMLNode.nodeName;
	}

	this.GetValue = function()
	{
		if(!this.CheckXMLNode(objXMLNode) || objXMLNode.nodeType != NODE_TEXT) return "";
		return objXMLNode.nodeValue;
	}

	this.GetType = function()
	{
		if(!this.CheckXMLNode(objXMLNode)) return -1;
		return objXMLNode.nodeType;
	}

	this.GetAttribute = function(strName)
	{
		if(!this.CheckXMLNode(objXMLNode) || objXMLNode.nodeType != NODE_ELEMENT) return "";
		return objXMLNode.getAttribute(strName);
	}

	this.ChildGetNum = function()
	{
		if(!this.CheckXMLNode(objXMLNode)) return 0;
		return objXMLNode.childNodes.length;
	}

	this.ChildGetIndex = function(nIndex)
	{
		if(!this.CheckXMLNode(objXMLNode)) return null;
		return new ESCFNode(objXMLNode.childNodes.item(nIndex));
	}

	this.ChildGetByName = function(strName)
	{
		if(!this.CheckXMLNode(objXMLNode)) return null;
		for(var i = 0; i < objXMLNode.childNodes.length; ++i) {
			var s = objXMLNode.childNodes.item(i).nodeName;
			if(s.toUpperCase() == strName.toUpperCase()) return new ESCFNode(objXMLNode.childNodes.item(i));
		}
		return null;
	}

	this.ChildGetAllText = function()
	{
		if(!this.CheckXMLNode(objXMLNode)) return "";
		var s = "";
		for(var i = 0; i < this.ChildGetNum(); ++i) {
			var objNode = this.ChildGetIndex(i);
			if(objNode.GetType() != NODE_TEXT) continue;
			s += objNode.GetValue();
		}
		return s;
	}

	this.GetFirstText = function()
	{
		if(!this.CheckXMLNode(objXMLNode)) return "";
		if(this.GetType() == NODE_TEXT) return this.GetValue();
		for(var i = 0; i < this.ChildGetNum(); ++i) {
			var s = this.ChildGetIndex(i).GetFirstText();
			if(s != "") return s;
		}
		return "";
	}
}

function ESCFListener(strChannelId, objFunction)
{
	this.strChannelId	= strChannelId;
	this.objFunction	= objFunction;
}

var g_ESCFMessageListeners = new Array();

function ESCF()
{
	this.XMLDoc		= null;

	this.GetRef = function(strId)
	{
		return (document.all) ? document.all[strId] : document.getElementById(strId);
	}

	this.QuoteHtmlAttribute = function(str)
	{
		str += "";
		str = str.replace(/\&/g, "&amp;");
		str = str.replace(/\</g, "&lt;");
		str = str.replace(/\>/g, "&gt;");
		str = str.replace(/\"/g, "&quot;");
		str = str.replace(/\'/g, "&apos;");
		return str;
	}

	this.LayerWrite = function(strId, strHtml)
	{
		var obj = this.GetRef(strId);
		if(obj == null || typeof(obj) == "undefined") return;
		obj.innerHTML = strHtml;
	}

	this.SwitchImage = function(strId, strFileName)
	{
		var objImage = this.GetRef(strId);
		if(objImage == null || typeof(objImage) == "undefined") return;
		objImage.src = strFileName;
	}

	this.CreateDateFromInternalFormatString = function(str)
	{
		try {
			var arr = str.split(",");
			if(arr.length != 6) return null;
			return new Date(arr[0], parseInt(arr[1], 10) - 1, arr[2], arr[3], arr[4], arr[5]); 
		} catch(e) {}
		return null;
	}

	this.CreateInternalFormatStringFromDate = function(objDate)
	{
		try {
			return (objDate instanceof Date) ? objDate.getFullYear() + "," + (objDate.getMonth() + 1) + "," + objDate.getDate() + "," + objDate.getHours() + "," + objDate.getMinutes() + "," + objDate.getSeconds() : "";
		} catch(e) {}
		return "";
	}

	this.Fix2Digits = function(str)
	{
		str += "";
		return (str.length < 2 ? "0" + str : str);
	}

	this.AdminIsLoggedIn = function(strPackage)
	{
		try {
			if(!this.IsAjaxEnabled()) return false;

			if(strPackage == "") strPackage = "sd_admin";

			var strGet = g_strSdServiceUrlAbs + "?type=admin&cmd=getloginpackages";
			if(strGet.search(/\[/) != -1 || strGet.search(/\]/) != -1) return false;
			if(this.DoRequest("GET", strGet, "")) {
				var objEntryNode = this.NodeGetRoot().ChildGetByName("sd_admin_admin_getloginpackages");
//				return objEntryNode != null && objEntryNode.GetAttribute("status") == "ok";
				if(objEntryNode == null || objEntryNode.GetAttribute("status") != "ok") return false;
				var arr = this.NodesGetByTagName("package");
				for(var i = 0; i < arr.length; ++i) {
					if(arr[i].GetAttribute("id") == strPackage) return true;
				}
			}
		} catch(e) {}

		return false;
	}

	this.IsAdminLoggedOn = function()
	{
		return this.AdminIsLoggedIn("");
	}

	this.MessageSend = function(strChannelId, strFromId, strCmd, nParam, strParam, objParam)
	{
		if(window.opener && typeof(window.opener.g_ESCFMessageListeners) != "undefined")
			g_ESCFMessageListeners = window.opener.g_ESCFMessageListeners;
		for(var i = 0; i < g_ESCFMessageListeners.length; ++i) {
			if(strChannelId == g_ESCFMessageListeners[i].strChannelId)
				g_ESCFMessageListeners[i].objFunction(strChannelId, strFromId, strCmd, nParam, strParam, objParam);
		}
	}

	this.MessageListenerAdd = function(strChannelId, objFunction)
	{
		g_ESCFMessageListeners[g_ESCFMessageListeners.length] = new ESCFListener(strChannelId, objFunction);
	}		
		
	this.IsAjaxEnabled = function()
	{
		var bOK = false;
		try {
			var objHttpXmlRequest = null;
			if(window.XMLHttpRequest) {		// Use native object
				objHttpXmlRequest = new XMLHttpRequest();
			} else {
				if(window.ActiveXObject) {	// ...otherwise, use the ActiveX control for IE5.x and IE6
					objHttpXmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
				}
			}
			bOK = objHttpXmlRequest != null;
			objHttpXmlRequest = null;
		} catch(e) { bOK = false; }
		return bOK;
	}

	this.NodeGetRoot = function()
	{
		return new ESCFNode(this.XMLDoc);
	}

	this.NodesGetByTagName = function(strTagName)
	{
		var arr = new Array();
		if(this.XMLDoc == null) return arr;
		var objItems = this.XMLDoc.getElementsByTagName(strTagName);
		for(var i = 0; i < objItems.length; ++i) {
			arr[i] = new ESCFNode(objItems.item(i));
		}
		return arr;
	}

	this.FormGetQuerystring = function(strFormId)
	{
		var objForm = this.GetRef(strFormId);
		if(objForm == null || typeof(objForm) + "" == "undefined") return "";

		var strRet = "";
		// Extract the name and value for each form element
		for(var i = 0; i < objForm.elements.length; ++i) {
			var objElement = objForm.elements[i];
			switch(objElement.type + "") {
				case "text":
				case "hidden":
				case "password":
				case "textarea":
					strRet += "&" + objElement.name + "=" + encodeURIComponent(objElement.value);
					break;

				case "select-one":
				case "select-multiple":
					for(var j = 0; j < objElement.options.length; ++j) {
						strRet += objElement.options[j].selected ? "&" + objElement.name + "=" + encodeURIComponent(objElement.options[j].value) : "";
					}
					break;

				case "checkbox":
				case "radio":
					strRet += objElement.checked ? "&" + objElement.name + "=" + encodeURIComponent(objElement.value) : "";
					break;
			}
		}
		if(strRet.substr(0, 1) == "&") strRet = strRet.substr(1);
		return strRet;
	}

	this.DoRequest = function(strMethod, strUrl, strData)
	{
		this.XMLDoc = null;
		var objHttpXmlRequest = null;
		if(window.XMLHttpRequest) {		// Use native object
			objHttpXmlRequest = new XMLHttpRequest();
		} else {
			if(window.ActiveXObject) {	// ...otherwise, use the ActiveX control for IE5.x and IE6
				objHttpXmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}

		objHttpXmlRequest.open(strMethod.toUpperCase(), strUrl, false);
		if(strMethod.search(/POST/i) == 0) {
			objHttpXmlRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		objHttpXmlRequest.send(strData);

		if(objHttpXmlRequest.status == 200) {
			this.XMLDoc = objHttpXmlRequest.responseXML;
		}
		return this.XMLDoc != null;
	}

	this.DoRequestPostForm = function(strFormId, strUrl)
	{
		return this.DoRequest("POST", strUrl, this.FormGetQuerystring(strFormId));
	}
}

//--------------------------------------------------------------------------------
//	Resource Picker... (requires jQuery)
//--------------------------------------------------------------------------------

// Custom Variables...
var g_strResPickerPackage		= "sd_admin";
var g_strResPickerType			= "image";
var g_strResPickerClose			= "Close";
var g_strResPickerSelectFile	= "Select file";
var g_strResPickerHit			= "hit";
var g_strResPickerHits			= "hits";
var g_strResPickerDBFailed		= "File upload succeeded, but the file could not be added to the database.";
var g_strResPickerUploadFailed	= "File upload failed, please try again.";
var g_nResPickerIconCols		= 4;

// Internal variables...
var g_strResPickerCurId			= "";
var g_strResPickerSearchFor		= "";
var g_nResPickerTimeout			= 0;

function FillResourcePicker(strId, nImageMargin, nIconWidth) 
{
	if(typeof(g_strResPickerSearchFor) == "string" && g_strResPickerSearchFor != "") $("#search_displaypicker").attr("value", g_strResPickerSearchFor).removeClass("blursearch");
	$.get(g_strSdServiceUrlAbs + "?type=resources&cmd=getresources&restype=" + encodeURIComponent(g_strResPickerType != "" ? g_strResPickerType : "image") + "&package=" + encodeURIComponent(g_strResPickerPackage) + "&searchfor=" + encodeURIComponent(g_strResPickerSearchFor) + "", function(data, strStatus, objHttpXmlRequest) {
		var objESCF = new ESCF();
		objESCF.XMLDoc = objHttpXmlRequest.responseXML;
		var arr = objESCF.NodesGetByTagName("resource");

		$("#" + strId).empty();
		$("#search_displaypicker_label").empty();
		$("#search_displaypicker_label").append("<span>" + (g_strResPickerSearchFor.length == 0 ? "" : arr.length + " " + (arr.length == 1 ? g_strResPickerHit : g_strResPickerHits)) + "</span>");
		var strCurSelId = $("#" + g_strResPickerCurId + "_resourceid").attr("value");
		for(var i = 0; i < arr.length; ++i) {
			var nImgWidth	= parseInt(arr[i].GetAttribute("width"), 10);
			var nImgHeight	= parseInt(arr[i].GetAttribute("height"), 10);
			var nIconHeight = nIconWidth;
			var bLandscape = nImgWidth > nImgHeight;
			var nW = nImgWidth > nIconWidth ? nIconWidth : nImgWidth;
			var nH = nImgHeight > nIconHeight ? nIconHeight : nImgHeight;
			if(nImgWidth != nImgHeight && (nImgHeight > nIconHeight || nImgWidth > nIconWidth)) {
				if(bLandscape) {
					nH = Math.round(nImgHeight / nImgWidth * nIconHeight);
				} else {
					nW = Math.round(nImgWidth / nImgHeight * nIconWidth);
				}
			}
			var nMarginTop		= (nIconHeight - nH);
			var nMarginBottom	= 0;
			var nMarginLeft		= Math.round((nIconWidth - nW) / 2);
			var nMarginRight	= nIconWidth - nW - nMarginLeft;
			var bPicked			= strCurSelId == arr[i].GetAttribute("src");
			var strResources = "";
			strResources += "<div style=\"float:left;text-align:center;padding-bottom:10px;margin-right:" + nImageMargin + "px;margin-bottom:" + (nImageMargin * 2) + "px;\">";
			strResources += "<div style=\"width:" + nIconWidth + "px;height:" + nIconHeight + "px;\">";
			strResources += "<a class=\"pick\" href=\"#\">";
			if(arr[i].GetAttribute("resourcetype") == "1") {
				strResources += "<img src=\"" + arr[i].GetAttribute("src").replace("\/" + g_strResPickerPackage + "\/", "/" + g_strResPickerPackage + "/tn120_") + "\" class=\"" + (bLandscape ? "landscape" : "portrait") + "\" name=\"" + arr[i].GetAttribute("src") + "\" style=\"width:" + nW + "px;height:" + nH + "px;margin:" + nMarginTop + "px " + nMarginRight + "px " + nMarginBottom + "px " + nMarginLeft + "px;\" title=\"" + arr[i].GetAttribute("title") + "\" alt=\"" + arr[i].GetAttribute("alt") + "\" />";
			} else {
				var strExt = arr[i].GetAttribute("src");
				strExt = strExt.replace(/[^\.]*\./g, "");
				var strFileIcon = "sd_res_generic.png";
				switch(strExt) {
					case "pdf":	strFileIcon = "sd_res_pdf.png";	break;
				}
//				nW = nH = nIconHeight;
//				nMarginTop = nMarginBottom = nMarginLeft = nMarginRight = 0;
				nW = nH = 72;
				nMarginTop		= (nIconHeight - nH);
				nMarginBottom	= 0;
				nMarginLeft		= Math.round((nIconWidth - nW) / 2);
				nMarginRight	= nIconWidth - nW - nMarginLeft;
				strResources += "<img src=\"" + g_strSdBoUrl + "files/" + strFileIcon + "\" class=\"" + (bLandscape ? "landscape" : "portrait") + "\" name=\"" + arr[i].GetAttribute("src") + "\" style=\"width:" + nW + "px;height:" + nH + "px;margin:" + nMarginTop + "px " + nMarginRight + "px " + nMarginBottom + "px " + nMarginLeft + "px;\" title=\"" + arr[i].GetAttribute("title") + "\" alt=\"" + arr[i].GetAttribute("alt") + "\" />";
			}
			strResources += "</a>";
			strResources += "</div>";
			strResources += "<div style=\"padding:2px;margin-top:2px;" + (bPicked ? "background-color:#ddd;color:#000;" : "") + "\">" + (typeof(SDStringLimit) == "function" ? SDStringLimit(arr[i].GetAttribute("title"), 20, "...") : arr[i].GetAttribute("title").substr(0, 20)) + "</div>";
			strResources += "</div>";
			$("#" + strId).append(strResources);
		}
		$("#" + strId).show();
	}, "text/xml");
}

function DisplayPicker(e)
{
		var strId = $(this).attr("id");
		if(g_strResPickerCurId == strId) return;
		g_strResPickerCurId = strId;

		// Fix for sd_eshop...
		if($(this).parents("#productimagerefs").length == 1)	g_strResPickerType = "image";
		if($(this).parents("#productfilerefs").length == 1)		g_strResPickerType = "file";

		$("#div_displaypicker").hide();
		
		var nWindowWidth = $(window).width();
		var nWindowHeight = $(window).height();
		
		var nCols			= 4
		var nPopupHeight	= 400;
		var nTopbarHeight	= 28;
		var nIconWidth		= 120;
		var nImageMargin	= 20;
		var nScroller		= 25;
		var nPopupWidth		= nIconWidth * nCols + nImageMargin * (nCols - 1 + 2) + nScroller;
		
		if(nWindowWidth < nPopupWidth - 80 && nWindowWidth > 200) {
			nPopupWidth = nWindowWidth - 80;
			nIconWidth = Math.round((nPopupWidth - nScroller - nImageMargin * (nCols - 1 + 2)) / nCols);
		}
		if(nWindowHeight < nPopupHeight - 80 && nWindowHeight > 100) {
			nPopupHeight = nWindowHeight - 80;
		}

		var nTotalHeight	= nPopupHeight + nTopbarHeight + (nImageMargin * 2);
		var nX				= (nWindowWidth - nPopupWidth) / 2;
		var nY				= (nWindowHeight - nTotalHeight) / 2;

		if(nX < 0) nX = 0;
		if(nY < 0) nY = 0;
		nX += $(document).scrollLeft();
		nY += $(document).scrollTop();
		
		var strDiv = "";
		strDiv += "<div id=\"div_displaypicker\" style=\"z-index:1;display:none;position:absolute;width:" + nPopupWidth + "px;left:" + nX + "px;top:" + nY + "px;padding:0;border:solid 1px #808080;\">";
		strDiv += "<div>";
		strDiv += "<table class=\"topbar\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"height:" + nTopbarHeight + "px;\"><tr><td style=\"vertical-align:middle;width:30px;\"><a href=\"#\" class=\"add\"><img src=\"" + g_strSdBoUrl + "img/sd_admin_plus.png\" alt=\"\" style=\"vertical-align:middle;margin:0 7px\" /></a><span style=\"position:relative;\" id=\"file_container\"></span></td><td style=\"vertical-align:middle;margin:0;\"><input type=\"text\" class=\"blursearch\" value=\"\" id=\"search_displaypicker\" style=\"height:14px;\" /><span id=\"search_displaypicker_label\" style=\"margin-left:5px;\"></span></td><td class=\"logo\" style=\"vertical-align:middle;text-align:right;\"><a href=\"#\" class=\"close\" title=\"" + g_strResPickerClose + "\"><img src=\"" + g_strSdBoUrl + "img/sd_admin_delete.png\" alt=\"\" title=\"" + g_strResPickerClose + "\" style=\"float:right;margin:0 7px\" /></a></td></tr></table>";
		strDiv += "</div>";
		strDiv += "<div style=\"height:" + nPopupHeight + "px;overflow:auto;padding:" + nImageMargin + "px 0 " + nImageMargin + "px " + nImageMargin + "px;border-top:solid 1px #808080;background-color:#ffffff;\" id=\"div_displaypicker_images\"></div>";
		strDiv += "</div>";
		if($("#div_displaypicker").length == 0) {
			$("body").prepend(strDiv);
		} else {
			$("#div_displaypicker").replaceWith(strDiv);
		}
		AttachSearchFormFocusEvents();

		$("#div_displaypicker").show();
		FillResourcePicker("div_displaypicker_images", nImageMargin, nIconWidth);

		$("#div_displaypicker a.close").click(function(e) {
			$("#div_displaypicker").hide();
			g_strResPickerCurId = "";
			e.preventDefault();
		});

		var bIframeAdded	= false;
		var bFormSubmitted	= false;
		$("#div_displaypicker a.add").click(function(e) {
			$.get(g_strSdServiceUrlAbs + "?type=admin&cmd=createtoken&cat=" + encodeURIComponent(g_strResPickerPackage) + "", function(data, strStatus, objHttpXmlRequest) {
				var objESCF = new ESCF();
				objESCF.XMLDoc = objHttpXmlRequest.responseXML;
				var arr = objESCF.NodesGetByTagName("sd_admin_admin_createtoken");
				if(arr.length == 1) {
					var strToken = arr[0].GetAttribute("token");

					$("#file_container").append("<div style=\"display:none;\"><iframe id=\"file_iframe\" name=\"file_iframe\" style=\"display:none;\" /></div>");
					$("#file_container").append("<form method=\"post\" action=\"" + g_strSdBoUrl + "sd_admin_fu" + (g_strSdExt == ".asp" ? ".aspx" : g_strSdExt) + "?cat=" + encodeURIComponent(g_strResPickerPackage) + "&t=" + encodeURIComponent(strToken) + "\" enctype=\"multipart/form-data\" id=\"file_form\" target=\"file_iframe\" style=\"position:absolute;top:0px;left:5px;background-color:#e8e8e8;border:solid 1px #808080;padding:10px;white-space:nowrap;\">" + g_strResPickerSelectFile + ":<br /><input type=\"file\" id=\"add_file\" name=\"add_file\" /></form>");
					bIframeAdded	= true;
					bFormSubmitted	= false;

					$("#file_form").mousedown(function(e) {
						e.stopPropagation();
					});
					
//					$(document).mousedown(function(e) {
//						if(!bIframeAdded) return;
//						if(!bFormSubmitted) return;
//						$("#file_iframe").remove();
//						$("#file_form").remove();
//						bIframeAdded = false;
//					});

					var interval = null;
					$("#add_file").click(function(e) {
						interval = setInterval(function() {
							if(!bIframeAdded) return;
							var strValue = $("#add_file").attr("value");
							if(strValue != "" && strValue != null && !bFormSubmitted) {
								$("#file_form")[0].submit();
								$("#file_form").css("display", "none");
								bFormSubmitted = true;
								clearInterval(interval);
								return;
							}
						}, 200);
					});

					$("#file_iframe").load(function(e) {
						var iframe = $("#file_iframe").first()[0];
						var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;

						var objESCF = new ESCF();
						objESCF.XMLDoc = (typeof(doc.XMLDocument) == "undefined" ? doc : doc.XMLDocument);
						var arrStatus = objESCF.NodesGetByTagName("swfileupload");
						var bDocLoaded = true;
						try {
							bDocLoaded = typeof(doc.body) == "undefined" || (typeof(doc.body) != "undefined" && doc.body.innerHTML.length > 0);
						} catch(e) {}
						if(bDocLoaded) {
							var bUploadError = true;
							if(arrStatus.length > 0) {
								if(arrStatus[0].GetAttribute("status") == "ok") {
									if(bIframeAdded) {
										$("#file_iframe").remove();
										$("#file_form").remove();
										bIframeAdded = false;
									}
									var arr = objESCF.NodesGetByTagName("file");
									if(arr.length > 0) {
										bUploadError = false;
										for(var i = 0; i < arr.length; ++i) {
											var strUrl = "";
											strUrl += g_strSdServiceUrlAbs + "?type=resources&cmd=addresource";
											strUrl += "&resourceid=" + encodeURIComponent(arr[i].GetAttribute("relpath"));
											strUrl += "&mimetype=" + encodeURIComponent(arr[i].GetAttribute("mimetype"));
											strUrl += "&url=" + encodeURIComponent(arr[i].GetAttribute("relpath"));
											strUrl += "&width=" + encodeURIComponent(arr[i].GetAttribute("width"));
											strUrl += "&height=" + encodeURIComponent(arr[i].GetAttribute("height"));
											strUrl += "&filesize=" + encodeURIComponent(arr[i].GetAttribute("filesize"));
											$.get(strUrl, function(data, strStatus, objHttpXmlRequest) {
												var objESCF = new ESCF();
												objESCF.XMLDoc = objHttpXmlRequest.responseXML;
												var arr = objESCF.NodesGetByTagName("sd_admin_resources_addresource");
												if(arr.length != 1 || arr[0].GetAttribute("status") != "ok") {
													// db update failed...
													alert(g_strResPickerDBFailed);
													if(bIframeAdded) {
														$("#file_iframe").remove();
														$("#file_form").remove();
														bIframeAdded = false;
													}
												} else {
													g_strResPickerSearchFor = "";
													$("#search_displaypicker").attr("value", "").blur();
												}
											});
										}
									}
								}
							}
							if(bUploadError) {
								// file upload failed...
								alert(g_strResPickerUploadFailed);
								if(bIframeAdded) {
									$("#file_iframe").remove();
									$("#file_form").remove();
									bIframeAdded = false;
								}
							}
						}
					});
				}
			});

			e.preventDefault();
			return false;
		});

		$(document).ajaxComplete(function(e, objXmlHttpRequest, ajaxOptions) {
			if(ajaxOptions.url.search(/addresource/i) != -1) {
				FillResourcePicker("div_displaypicker_images", nImageMargin, nIconWidth);
			}
			$("#div_displaypicker_images a.pick").click(function(e) {
				$("#div_displaypicker").hide();

				if(g_strResPickerCurId != "") {
					var strTypeId = g_strResPickerCurId;
					var n = strTypeId.search(/__/);
					if(n != -1) {
						strTypeId = strTypeId.substr(0, n);
						var strResourceId	= $(this).children("img").first().attr("name");
						var strTnSrc		= $(this).children("img").first().attr("src");
						$("#" + g_strResPickerCurId).children("img").attr("src", strTnSrc);
						var strPickClass = $(this).children("img").first().attr("class");

						var strFields = "";
						var strName = $("#" + strTypeId + "_fields").attr("name")
						var arr = strName.split("|||");
						var strResourceTypeId	= arr[0];
						var strMaxCount			= arr[1];
						strFields += "<div id=\"" + strTypeId + "_fields\" name=\"" + strName + "\">\r\n";
						var nCount = 0;
						$(".displaypicker[id^=" + strTypeId + "]").each(function(e) {
							var strId		= $(this).attr("id");
							var strName		= $(this).attr("name");
							var strResId	= g_strResPickerCurId == strId ? strResourceId : strName;
							var strClass	= g_strResPickerCurId == strId ? strPickClass : $(this).parent().attr("class");
							if(strResId != "") {
								strFields += "<input type=\"hidden\" id=\"" + strTypeId + "__" + nCount + "_resourceid\" name=\"" + strTypeId + "__" + nCount + "_resourceid\" value=\"" + strResId + "\" class=\"" + strClass + "\" />\r\n";
								strFields += "<input type=\"hidden\" id=\"" + strTypeId + "__" + nCount + "_resourcetypeid\" name=\"" + strTypeId + "__" + nCount + "_resourcetypeid\" value=\"" + strResourceTypeId + "\" />\r\n";
								strFields += "<input type=\"hidden\" id=\"" + strTypeId + "__" + nCount + "_sortorder\" name=\"" + strTypeId + "__" + nCount + "_sortorder\" value=\"" + nCount + "\" />\r\n";
								++nCount;
							}
						});
						strFields += "<input type=\"hidden\" id=\"" + strTypeId + "_num\" name=\"" + strTypeId + "_num\" value=\"" + nCount + "\" />";
						strFields += "</div>\r\n";
						$("#" + strTypeId + "_fields").replaceWith(strFields);

						RefreshResourceList(strTypeId);
					}
				}
				g_strResPickerCurId = "";
				e.preventDefault();
			});
		});

		$("#search_displaypicker").keyup(function(e) {
			g_strResPickerSearchFor = $(this).attr("value");
			FillResourcePicker("div_displaypicker_images", nImageMargin, nIconWidth);
		});

		$(document).keyup(function(e) {
			if(e.keyCode == 27) {	// escape key
				if(bIframeAdded) {
					$("#file_iframe").remove();
					$("#file_form").remove();
					bIframeAdded = false;
				}
				$("#div_displaypicker").hide();
				g_strResPickerCurId = ""

				e.stopPropagation();
				e.preventDefault();
			}
		});

		e.preventDefault();
}

function RefreshResourceList(strId)
{
	var strPicker = "<div id=\"" + strId + "\">";
	strPicker += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
	strPicker += "<tr>";
	for(var i = 0; i < g_nResPickerIconCols; ++i) strPicker += "<td style=\"padding:0;\"><div style=\"width:130px;height:1px;\"></div></td>\r\n";
	strPicker += "</tr><tr>";
	var nCount = 0;
	$("#" + strId + "_fields input[id$=\"_resourceid\"]").each(function(nIndex, obj) {
		if(nCount > 0 && nCount % g_nResPickerIconCols == 0) strPicker += "</tr><tr>";

		var strClass = $(this).attr("class");

		var strPickerId = strId + "__" + nCount;
		strPicker += "<td style=\"vertical-align:bottom;text-align:center;\"><div style=\"position:relative;height:120px;\" class=\"" + strClass + "\"><a href=\"#\" class=\"displaypicker res_core\" id=\"" + strPickerId + "\" name=\"" + $(this).attr("value") + "\">";

		var strExt = $(this).attr("value");
		strExt = strExt.replace(/[^\.]*\./g, "").toLowerCase();
		if(strExt == "jpg" || strExt == "jpe" || strExt == "jpeg" || strExt == "gif" || strExt == "png") {
			strPicker += "<img class=\"picker " + strClass + "\" src=\"" + $(this).attr("value") + "\" alt=\"" + $(this).attr("value") + "\" title=\"" + $(this).attr("value") + "\" />";
		} else {
			var strFileIcon = "sd_res_generic.png";
			switch(strExt) {
				case "pdf":	strFileIcon = "sd_res_pdf.png";	break;
			}
			nW = nH = 72;
			nIconWidth = nIconHeight = 120;
			nMarginTop		= Math.round((nIconHeight - nH) / 2);
			nMarginBottom	= nIconHeight - nH - nMarginTop;
			nMarginLeft		= Math.round((nIconWidth - nW) / 2);
			nMarginRight	= nIconWidth - nW - nMarginLeft;
			
			var strLabel = $(this).attr("value");
			strLabel = strLabel.replace(/[^\/]*\//g, "");
			strLabel = typeof(SDStringLimit) == "function" ? SDStringLimit(strLabel, 20, "...") : strLabel.substr(0, 20);
			strPicker += "<img class=\"picker " + strClass + "\" src=\"files/" + strFileIcon + "\" style=\"width:" + nW + "px;height:" + nH + "px;margin:" + nMarginTop + "px " + nMarginRight + "px " + nMarginBottom + "px " + nMarginLeft + "px;border:none;\" alt=\"" + $(this).attr("value") + "\" title=\"" + $(this).attr("value") + "\" />";
			strPicker += "<div style=\"overflow:hidden;position:absolute;bottom:10px;left:0;text-align:center;width:" + nIconWidth + "px;color: #373B44;font-family:arial,sans-serif;font-size:8pt;\">" + SDQuoteForJs(strLabel) + "</div>";
		}
		strPicker += "</a></div></td>";
		++nCount;
	});
	if(nCount < parseInt($("#" + strId + "_fields").attr("name").split("|||")[1], 10)) {
		if(nCount > 0 && nCount % g_nResPickerIconCols == 0) strPicker += "</tr><tr>";
		strPickerId = strId + "__" + nCount;
		strPicker += "<td style=\"position:relative;width:120px;\"><a href=\"#\" class=\"displaypicker\" id=\"" + strPickerId + "\" name=\"\"><img class=\"picker\" src=\"" + g_strSdBoUrl + "files/sd_no_image_" + g_strSdLangId + ".png\" /></a></td>";
		++nCount;
	}
	var nFillColspan = g_nResPickerIconCols - nCount % g_nResPickerIconCols;
	if(nFillColspan > 0 && nFillColspan < g_nResPickerIconCols) strPicker += "<td " + (nFillColspan > 1 ? "colspan=\"" + nFillColspan + "\"" : "") + ">&nbsp;</td>";
	strPicker += "</tr>";
	strPicker += "</tbody></table>";
	strPicker += "</div>";

	$("#" + strId).replaceWith(strPicker)
	$("a.displaypicker").click(DisplayPicker);
	$("a.res_core").mouseover(function(e) {
		clearTimeout(g_nResPickerTimeout);
		$("#res_delete_container").remove();
		$(this).parent().prepend("<div id=\"res_delete_container\"><a href=\"#\" class=\"res_delete\" title=\"Remove\"><img src=\"" + g_strSdBoUrl + "files/sd_res_delete.png\" alt=\"\" /></a></div>");

		$("a.res_delete").click(function(e) {
			var strCoreId = $(this).parent().parent().children().filter("a.res_core").attr("id");
			$("input[id^=" + strCoreId + "_]").remove();
			clearTimeout(g_nResPickerTimeout);
			$("#res_delete_container").remove();

			var nPos = strCoreId.search(/__/);
			var nIndexSource = parseInt(strCoreId.substr(nPos + 2), 10);
			var strTypeId = strCoreId.substr(0, nPos);
			{
				var $objCount = $("#" + strTypeId + "_num");
				var strCount = $objCount.attr("value");
				var nCount = parseInt(strCount, 10);
				nCount = isNaN(nCount) ? 0 : (nCount - 1);
				$objCount.attr("value", nCount);
			}

			$("input[id^=" + strTypeId + "]").each(function(nIndex, obj) {
				var strId = $(this).attr("id");
				var nPos = strId.search(/__/);
				var nCurIndex = parseInt(strId.substr(nPos + 2), 10);
				if(nCurIndex > nIndexSource) {
					$(this).attr("id", strId.replace("__" + nCurIndex + "_", "__" + (nCurIndex - 1) + "_"));
					$(this).attr("name", strId.replace("__" + nCurIndex + "_", "__" + (nCurIndex - 1) + "_"));
				}
			});

			RefreshResourceList(strTypeId);
			return false;
		});
	});
	$("a.res_core").mouseout(function(e) {
		if($(e.relatedTarget).parent().parent().attr("id") == "res_delete_container") return;
		clearTimeout(g_nResPickerTimeout);
		g_nResPickerTimeout = setTimeout("$(\"#res_delete_container\").remove()", 1000);
	});
}

//--------------------------------------------------------------------------------
// g_sdadmin_drag...
//--------------------------------------------------------------------------------
g_sdadmin_drag = {
	dragid:				""
	, downid:			""
	, backdropid:		""
	, startmouse_x:		0
	, startmouse_y:		0
	, offset_x:			0
	, offset_y:			0
	, dragid:			''
	, width:			0
	, height:			0
	, width_screen:		0
	, height_screen:	0
	, isdragging:		false
	
	, Attach: function(dragid, backdropid, downid)
		{
			if(typeof(dragid) != "string") return false;
			if(typeof(backdropid) != "string") return false;
			if(typeof(downid) != "string") downid = dragid;
			if($('#' + dragid).length == 0 || $('#' + backdropid).length == 0 || $('#' + downid).length == 0) return false;
		
			$('#' + downid).bind('mousedown', {dragid: dragid, downid: downid, backdropid: backdropid}, g_sdadmin_drag.onmousedown);
			return true;
		}

	, AdjustOffset: function(x, y) 
		{
			if(x > g_sdadmin_drag.width_screen - g_sdadmin_drag.width) x = g_sdadmin_drag.width_screen - g_sdadmin_drag.width;
			if(y > g_sdadmin_drag.height_screen - g_sdadmin_drag.height) y = g_sdadmin_drag.height_screen - g_sdadmin_drag.height;
			if(x < 0) x = 0;
			if(y < 0) y = 0;
			return { left: x, top: y };
		}

	, DocToScreenX: function(docx) {  return docx - $(window).scrollLeft(); }
	, DocToScreenY: function(docy) {  return docy - $(window).scrollTop(); }
	, ScreenToDoc: function(screenpos) {  return { left: screenpos.left + $(window).scrollLeft(), top: screenpos.top + $(window).scrollTop() }}

	, onmousedown: function(e) 
		{
			g_sdadmin_drag.isdragging	= true;
			g_sdadmin_drag.dragid		= e.data.dragid;
			g_sdadmin_drag.downid		= e.data.downid;
			g_sdadmin_drag.backdropid	= e.data.backdropid;
			
			var $objDrag = $("#" + g_sdadmin_drag.dragid);
			g_sdadmin_drag.startmouse_x =	g_sdadmin_drag.DocToScreenX(e.pageX);
			g_sdadmin_drag.startmouse_y =	g_sdadmin_drag.DocToScreenY(e.pageY);
			g_sdadmin_drag.offset_x =		g_sdadmin_drag.DocToScreenX($objDrag.offset().left);
			g_sdadmin_drag.offset_y =		g_sdadmin_drag.DocToScreenY($objDrag.offset().top);
			g_sdadmin_drag.dragid =			$objDrag.attr("id");
			g_sdadmin_drag.width =			$objDrag.outerWidth();
			g_sdadmin_drag.height =			$objDrag.outerHeight();
			g_sdadmin_drag.width_screen =	$(window).width();
			g_sdadmin_drag.height_screen =	$(window).height();
			
			e.stopPropagation();
			e.preventDefault();			
		
			//	Bind events...
			$('#' + g_sdadmin_drag.backdropid)
				.bind('mousemove',	g_sdadmin_drag.onmousemove)
				.bind('mouseup mouseleave',	g_sdadmin_drag.onmouseup);

			$('#' + g_sdadmin_drag.dragid)
				.bind('mousemove',	g_sdadmin_drag.onmousemove)
				.bind('mouseup',	g_sdadmin_drag.onmouseup);
				
			if(g_sdadmin_drag.downid != g_sdadmin_drag.dragid) {
				$('#' + g_sdadmin_drag.downid)
					.bind('mousemove',	g_sdadmin_drag.onmousemove)
					.bind('mouseup',	g_sdadmin_drag.onmouseup);
			}

			$(document).bind('keydown',	g_sdadmin_drag.onkeydown);
		
			e.stopPropagation();
			e.preventDefault();
			
			$('#' + g_sdadmin_drag.backdropid).addClass('sd_admin_backdrop_drag').removeClass('sd_admin_backdrop');
		}

	, onmousemove: function(e) 
		{
			var x = g_sdadmin_drag.DocToScreenX(e.pageX) - g_sdadmin_drag.startmouse_x + g_sdadmin_drag.offset_x;
			var y = g_sdadmin_drag.DocToScreenY(e.pageY) - g_sdadmin_drag.startmouse_y + g_sdadmin_drag.offset_y;
			$("#" + g_sdadmin_drag.dragid).offset(g_sdadmin_drag.ScreenToDoc(g_sdadmin_drag.AdjustOffset(x, y)));
			e.stopPropagation();
			e.preventDefault();
		}

	, onmouseup: function(e) 
		{
			$('#' + g_sdadmin_drag.backdropid)
				.unbind('mousemove', g_sdadmin_drag.onmousemove)
				.unbind('mouseup mouseout', g_sdadmin_drag.onmouseup);
				
			$('#' + g_sdadmin_drag.dragid)
				.unbind('mousemove', g_sdadmin_drag.onmousemove)
				.unbind('mouseup', g_sdadmin_drag.onmouseup);

			if(g_sdadmin_drag.downid != g_sdadmin_drag.dragid) {
				$('#' + g_sdadmin_drag.downid)
					.unbind('mousemove', g_sdadmin_drag.onmousemove)
					.unbind('mouseup', g_sdadmin_drag.onmouseup);
			}

			g_sdadmin_drag.isdragging	= false;
			$(document).unbind('keydown', g_sdadmin_drag.onkeydown);
			e.stopPropagation();
			e.preventDefault();

			$('#' + g_sdadmin_drag.backdropid).addClass('sd_admin_backdrop').removeClass('sd_admin_backdrop_drag');
		}
		
	, onkeydown: function(e)
		{
			// Handle esc...
			if(e.which == 27) {
				$("#" + g_sdadmin_drag.dragid).offset(g_sdadmin_drag.ScreenToDoc(g_sdadmin_drag.AdjustOffset(g_sdadmin_drag.offset_x, g_sdadmin_drag.offset_y)));
				g_sdadmin_drag.onmouseup(e);
			}
			e.stopPropagation();
			e.preventDefault();
		}		
};

//--------------------------------------------------------------------------------
// SdDialog...
//--------------------------------------------------------------------------------
g_sd_admin_dialog = {
	instances:	[]

	, SetCookie: function(name, value)
		{
			document.cookie = name + "=" + escape(value);
		}
	
	, GetCookie: function(name)
		{
			var all = document.cookie.split(';');
			for(var i = 0; i < all.length; ++i) {
				var tuple = all[i].split('=');
				if(tuple.length !== 2) continue;
				var n = tuple[0].replace(/^\s+|\s+$/g, '');
				if(n == name) {
					return unescape(tuple[1].replace(/^\s+|\s+$/g, ''));
				}
			}
			return null;
		}

	, DialogGetStart: function(id, width, z, title, bAddCloseButton)
		{
			var screenwidth		= $(window).width();
			var screenheight	= $(window).height();
		
			var left		= parseInt(($(window).width() - width) / 2, 10)
			var top			= parseInt(z, 10);
			var posstored	= g_sd_admin_dialog.GetCookie(id + '_pos');
			if(typeof(posstored) == "string") {
				var arrPosStored = posstored.split(",");
				if(arrPosStored.length == 2) {
					left	= parseInt(arrPosStored[0], 10);
					top		= parseInt(arrPosStored[1], 10);
				}
			}

			if(left > screenwidth - width)	left	= screenwidth - width;
			if(top > screenheight - 50)		top		= screenheight - 50;
			if(left < 0)					left	= 0;
			if(top < 0)						top		= 0;

			var nAddWidth = 16 + 11 + 11 + 16;
			var s = "";
			s += '<div class="sd_admin_backdrop" id="' + id + '_backdrop" style="z-index:' + z + ';">';
			s += '<div class="sd_admin_dialog" id="' + id + '" style="position:fixed;z-index:' + (z + 1) + ';width:' + (width + nAddWidth) + 'px;margin:0;left:' + left + 'px;top:' + top + 'px;">';
			s += '<table cellpadding="0" cellspacing="0" border="0">';
			s += '<tbody>';
			s += '<tr>';
			s += '<td class="sd_tl">&nbsp;</td>';
			s += '<td class="sd_t" id="' + id + '_down"><p>' + title + '</p></td>';
			s += '<td class="sd_tr">' + (bAddCloseButton ? '<div><a href="#"  id="' + id + '_close" title="' + SDQuoteForJs(g_sd_admin_client_strings.s("dlg_close")) + '"></a></div>' : '&nbsp;') + '</td>';
			s += '</tr>';
			s += '<tr>';
			s += '<td class="sd_l">&nbsp;</td>';
			s += '<td class="sd_c">';
			return s;
		}

	, DialogGetEnd: function()
		{
			var s = "";
			s += '</td>';
			s += '<td class="sd_r">&nbsp;</td>';
			s += '</tr>';
			s += '<tr>';
			s += '<td class="sd_bl">&nbsp;</td>';
			s += '<td class="sd_b">&nbsp;</td>';
			s += '<td class="sd_br">&nbsp;</td>';
			s += '</tr>';
			s += '</tbody>';
			s += '</table>';
			s += '</div>';
			s += '</div>';
			return s;
		}

	, DialogStart: function(id, content, width, z, title, funcclose)
		{
			$("#" + id + "_backdrop").remove();	// make sure it doesn't exist
			$("body").prepend(g_sd_admin_dialog.DialogGetStart(id, width, z, title, typeof(funcclose) == "function") + content + g_sd_admin_dialog.DialogGetEnd());
			g_sdadmin_drag.Attach(id, id + "_backdrop", id + "_down");
			
			$("#" + id + "_close").click(function(e) {
				if(funcclose(id) === false) return false;
				g_sd_admin_dialog.DialogEnd(id);
				return false;
			});

			$("#" + id).find("input").first().focus();

			$(document).bind("keydown." + id, { id: id }, function(e)
				{
					// Handle esc...
					if(!g_sdadmin_drag.isdragging && g_sd_admin_dialog.instances[g_sd_admin_dialog.instances.length - 1] == e.data.id && e.which == 27) {
						if(funcclose(e.data.id) !== false) {
							g_sd_admin_dialog.DialogEnd(e.data.id);
							e.stopPropagation();
							e.preventDefault();
						}
					}
				});
			g_sd_admin_dialog.instances.push(id);
		}

	, DialogEnd: function(id)
		{
			if($("#" + id).length == 1) {
				var offset = $("#" + id).offset();
				g_sd_admin_dialog.SetCookie(id + '_pos', g_sdadmin_drag.DocToScreenX(offset.left) + ',' + g_sdadmin_drag.DocToScreenY(offset.top));
			}

			$("#" + id + "_backdrop").remove();

			$(document).unbind("keydown." + id);
			if(g_sd_admin_dialog.instances[g_sd_admin_dialog.instances.length - 1] == id) {
				g_sd_admin_dialog.instances.pop();
			}
		}
};

//--------------------------------------------------------------------------------
// SdResourcePicker...
//--------------------------------------------------------------------------------
function SdResourcePicker(strVarName)
{
	var objThis					= this;
	objThis.self				= strVarName;
	this.strPickerId			= "sdrespick_div";
	this.strCurPickerId			= null;
	this.strResPickerSearchFor	= "";

	this.FileSizeToString = function(nFileSize)
	{
		if(nFileSize < 1024)		return nFileSize + " bytes";
		if(nFileSize < 1024 * 1024) return (Math.round((nFileSize / 1024) * 10) / 10) + " KB";
		return (Math.round((nFileSize / (1024 * 1024)) * 10) / 10) + " MB";
	}

	this.OnSearchFormFocus = function(bFocus)
	{
		var strId = objThis.strPickerId + "_search";
		var $obj = $("#" + strId);
		var strValue = $obj.attr("value");
		$obj.css({color:""});
		if(bFocus && strValue == g_sd_admin_client_strings.s("dlgrespicker_defaultsearchtext")) {
			$obj.attr("value", "");
		}
		if(!bFocus && (strValue == "" || strValue == g_sd_admin_client_strings.s("dlgrespicker_defaultsearchtext"))) {
			$obj.attr("value", g_sd_admin_client_strings.s("dlgrespicker_defaultsearchtext"));
			$obj.css({color:"#aaa"});
		}
	}

	this.Fill = function(o, funcCallbackPick, nImageMargin, nIconWidth)
	{
		var $objImages = $("#" + objThis.strPickerId + "_images");

		$.get(o.admin_relpath + g_strSdServiceUrl + "?type=resources&cmd=getresources&restype=" + encodeURIComponent(o.restype) + "&package=" + encodeURIComponent(o.packagename) + "&searchfor=" + encodeURIComponent(objThis.strResPickerSearchFor) + "", function(data, strStatus, objHttpXmlRequest) {
			var objESCF = new ESCF();
			objESCF.XMLDoc = objHttpXmlRequest.responseXML;
			var arr = objESCF.NodesGetByTagName("resource");

			$objImages.empty();
			$("#" + objThis.strPickerId + "_search_result").empty().append("<span>" + arr.length + " " + SDQuoteForJs(arr.length == 1 ? g_sd_admin_client_strings.s("dlgrespicker_hit") : g_sd_admin_client_strings.s("dlgrespicker_hits")) + "." + (objThis.strResPickerSearchFor.length == 0 ? "" : " (" + SDQuoteForJs(g_sd_admin_client_strings.s("dlgrespicker_searchedfor")) + " \"" + objThis.strResPickerSearchFor + "\")") + "</span>");
			var strCurSelId = o.src;
			if(strCurSelId != "" && strCurSelId.search(o.admin_relpath) == 0) {
				strCurSelId = strCurSelId.replace(o.admin_relpath, "");
			}
			for(var i = 0; i < arr.length; ++i) {
				var strSrc		= arr[i].GetAttribute("src");
				var nImgWidth	= parseInt(arr[i].GetAttribute("width"), 10);
				var nImgHeight	= parseInt(arr[i].GetAttribute("height"), 10);
				var nIconHeight = nIconWidth;
				var bLandscape	= nImgWidth > nImgHeight;
				var nW			= nImgWidth > nIconWidth ? nIconWidth : nImgWidth;
				var nH			= nImgHeight > nIconHeight ? nIconHeight : nImgHeight;
				if(nImgWidth != nImgHeight && (nImgHeight > nIconHeight || nImgWidth > nIconWidth)) {
					if(bLandscape) {
						nH = Math.round(nImgHeight / nImgWidth * nIconHeight);
					} else {
						nW = Math.round(nImgWidth / nImgHeight * nIconWidth);
					}
				}
				var nMarginTop		= Math.round((nIconHeight - nH) / 2);
				var nMarginBottom	= nIconHeight - nH - nMarginTop;
				var nMarginLeft		= Math.round((nIconWidth - nW) / 2);
				var nMarginRight	= nIconWidth - nW - nMarginLeft;
				var bPicked			= strCurSelId == strSrc;

				var strTitle = strSrc.replace(/.*\//, "");
				strTitle += " (" + objThis.FileSizeToString(parseInt(arr[i].GetAttribute("filesize"), 10));
				if(arr[i].GetAttribute("resourcetype") == "1") {
					strTitle += ", " + arr[i].GetAttribute("width") + " x " + arr[i].GetAttribute("height") + " " + SDQuoteForJs(g_sd_admin_client_strings.s("dlgrespicker_pixels"));
				}
				strTitle += ")";

				var strResources = "";
				strResources += "<div class=\"rp_item\" style=\"margin-right:" + nImageMargin + "px;margin-bottom:" + (nImageMargin * 2) + "px;\">";
				strResources += "<div class=\"rp_pick\" title=\"" + objESCF.QuoteHtmlAttribute(strTitle) + "\" style=\"width:" + nIconWidth + "px;height:" + nIconHeight + "px;\" onmouseover=\"$(this).addClass('rp_over');\" onmouseout=\"$(this).removeClass('rp_over');\">";

				var strResData = strSrc;
				strResData += "|||" + arr[i].GetAttribute("title");
				strResData += "|||" + arr[i].GetAttribute("width");
				strResData += "|||" + arr[i].GetAttribute("height");
				
				if(arr[i].GetAttribute("resourcetype") == "1") {
					strResources += "<img src=\"" + o.admin_relpath + strSrc.replace("\/" + o.packagename + "\/", "/" + o.packagename + "/tn120_") + "\" name=\"" + objESCF.QuoteHtmlAttribute(strResData) + "\" style=\"width:" + nW + "px;height:" + nH + "px;margin:" + nMarginTop + "px " + nMarginRight + "px " + nMarginBottom + "px " + nMarginLeft + "px;border:none;\" alt=\"" + objESCF.QuoteHtmlAttribute(arr[i].GetAttribute("alt")) + "\" />";
				} else {
					var strExt = strSrc;
					strExt = strExt.replace(/[^\.]*\./g, "").toLowerCase();
					var strFileIcon = "sd_res_generic.png";
					switch(strExt) {
						case "pdf":	strFileIcon = "sd_res_pdf.png";	break;
					}
//					nW = nH = nIconHeight;
//					nMarginTop = nMarginBottom = nMarginLeft = nMarginRight = 0;
					nW = nH = 72;
					nMarginTop		= Math.round((nIconHeight - nH) / 2);
					nMarginBottom	= nIconHeight - nH - nMarginTop;
					nMarginLeft		= Math.round((nIconWidth - nW) / 2);
					nMarginRight	= nIconWidth - nW - nMarginLeft;
					strResources += "<img src=\"" + o.admin_relpath + "files/" + strFileIcon + "\" name=\"" + objESCF.QuoteHtmlAttribute(strResData) + "\" style=\"width:" + nW + "px;height:" + nH + "px;margin:" + nMarginTop + "px " + nMarginRight + "px " + nMarginBottom + "px " + nMarginLeft + "px;border:none;\" alt=\"" + objESCF.QuoteHtmlAttribute(arr[i].GetAttribute("alt")) + "\" />";
				}
				strResources += "</div>";
//				strResources += "nW: " + nW + "<br />nH: " + nH + "<br />nImgWidth: " + nImgWidth + "<br />nImgHeight: " + nImgHeight + "<br />nIconWidth: " + nIconWidth + "<br />nIconHeight: " + nIconHeight + "";
				strResources += "<div class=\"rp_label" + (bPicked ? " rp_sel" : "") + "\">" + objESCF.QuoteHtmlAttribute(typeof(SDStringLimit) == "function" ? SDStringLimit(arr[i].GetAttribute("title"), 20, "...") : arr[i].GetAttribute("title").substr(0, 20)) + "</div>";
				strResources += "</div>";
				$objImages.append(strResources);
			}
			$objImages.show();

			$("#" + objThis.strPickerId + "_images div.rp_pick").click(function(e) {
				if(objThis.strCurPickerId != null) {
					var strResData = o.admin_relpath + $(this).children("img").first().attr("name");
					var objRes = { src: "", title: "", width: 0, height: 0 };
					var arr = strResData.split("|||");
					for(var i = 0; i < arr.length; ++i) {
						switch(i) {
							case 0: objRes.src		= arr[i];	break;
							case 1: objRes.title	= arr[i];	break;
							case 2: objRes.width	= arr[i];	break;
							case 3: objRes.height	= arr[i];	break;
						}
					}
					funcCallbackPick(objRes);
				}
				objThis.Close();
			});

		}, "text/xml");
	}

	this.Close = function()
	{
		objThis.strCurPickerId = null;
		g_sd_admin_dialog.DialogEnd(objThis.strPickerId);
	}

	this.Show = function(o, funcCallbackPick)
	{
		if(objThis.strCurPickerId == o.id) return;
		objThis.strCurPickerId = o.id;

		var nWindowWidth	= $(window).width();
		var nWindowHeight	= $(window).height();
		var nTopbarHeight	= 28;
		var nIconWidth		= 120;
		var nImageMargin	= 20;
		var nScroller		= 25;
		var nCols			= Math.max(2, Math.min(parseInt((nWindowWidth - nScroller - nIconWidth) / (nIconWidth + nImageMargin)), 5));	// 2 - 5 cols
		var nPopupHeight	= 420;	// 140 (320)
		while(nPopupHeight > 140 && nWindowHeight < nPopupHeight + 180) nPopupHeight -= 140;
		var nPopupWidth		= (nIconWidth + 2) * nCols + nImageMargin * (nCols - 1 + 2) + nScroller;
		var bIsTypeImage	= o.restype == "image";
		
		var strContent = "";
		strContent += "<div class=\"sd_c_respicker\">";
		strContent += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"rp_topbar\" style=\"height:" + nTopbarHeight + "px;\"><tbody>";
		strContent += "<tr>";
		strContent += "<td class=\"rp_c1\">";
		strContent += "<input type=\"button\" class=\"rp_add sd_btn\" value=\"" + SDQuoteForJs(bIsTypeImage ? g_sd_admin_client_strings.s("dlgrespicker_import_image") : g_sd_admin_client_strings.s("dlgrespicker_import_file")) + "\" />";
		strContent += "<span style=\"position:relative;\" id=\"" + objThis.strPickerId + "_file_container\"></span>";
		strContent += "</td>";
		strContent += "<td class=\"rp_c2\">";
		strContent += "<form id=\"" + objThis.strPickerId + "_searchform\" action=\"#\">";
		strContent += "<input type=\"text\" class=\"rp_search_field\" value=\"" + objThis.strResPickerSearchFor + "\" id=\"" + objThis.strPickerId + "_search\" />";
		strContent += "<input type=\"submit\" value=\"" + SDQuoteForJs(g_sd_admin_client_strings.s("dlgrespicker_search")) + "\" />";
		strContent += "</form>";
		strContent += "</td>";
		strContent += "</tr>";
		strContent += "</tbody></table>";
		strContent += "<div id=\"" + objThis.strPickerId + "_images\" style=\"height:" + nPopupHeight + "px;overflow:auto;padding:" + nImageMargin + "px 0 " + nImageMargin + "px " + nImageMargin + "px;border:solid 1px #a4a4a4;background-color:#ffffff;\"></div>";
		strContent += "<div id=\"" + objThis.strPickerId + "_search_result\" class=\"rp_search_result\">&nbsp;</div>";
		strContent += "</div>";

		g_sd_admin_dialog.DialogStart(objThis.strPickerId, strContent, nPopupWidth, 200, SDQuoteForJs(bIsTypeImage ? g_sd_admin_client_strings.s("dlgrespicker_title_image") : g_sd_admin_client_strings.s("dlgrespicker_title_file")), objThis.Close);

		// Attach search form focus events...
		$("#" + objThis.strPickerId + "_search").unbind("focus blur").focus(function(e)	{ objThis.OnSearchFormFocus(true); }).blur(function(e) { objThis.OnSearchFormFocus(false); }).trigger("blur");

		objThis.Fill(o, funcCallbackPick, nImageMargin, nIconWidth);

		var bIframeAdded	= false;
		var bFormSubmitted	= false;
		$("#" + objThis.strPickerId + " input.rp_add").click(function(e) {
			$.get(o.admin_relpath + g_strSdServiceUrl + "?type=admin&cmd=createtoken&cat=" + encodeURIComponent(o.packagename) + "", function(data, strStatus, objHttpXmlRequest) {
				var objESCF = new ESCF();
				objESCF.XMLDoc = objHttpXmlRequest.responseXML;
				var arr = objESCF.NodesGetByTagName("sd_admin_admin_createtoken");
				if(arr.length == 1) {
					var strToken = arr[0].GetAttribute("token");

					$("#" + objThis.strPickerId + "_file_container").append("<div style=\"display:none;\"><iframe id=\"" + objThis.strPickerId + "_file_iframe\" name=\"" + objThis.strPickerId + "_file_iframe\" style=\"display:none;\" /></div>");
					$("#" + objThis.strPickerId + "_file_container").append("<form method=\"post\" action=\"" + o.admin_relpath + "sd_admin_fu" + (g_strSdExt == ".asp" ? ".aspx" : g_strSdExt) + "?cat=" + encodeURIComponent(o.packagename) + "&t=" + encodeURIComponent(strToken) + "\" enctype=\"multipart/form-data\" id=\"" + objThis.strPickerId + "_file_form\" target=\"" + objThis.strPickerId + "_file_iframe\" style=\"position:absolute;top:0px;left:5px;background-color:#e8e8e8;border:solid 1px #808080;padding:10px;white-space:nowrap;\">" + SDQuoteForJs(g_sd_admin_client_strings.s("dlgrespicker_selectfile")) + ":<br /><input type=\"file\" id=\"" + objThis.strPickerId + "_add_file\" name=\"add_file\" /></form>");
					bIframeAdded	= true;
					bFormSubmitted	= false;

					$("#" + objThis.strPickerId + "_file_form").mousedown(function(e) {
						e.stopPropagation();
					});
					
					var interval = null;
					$("#" + objThis.strPickerId + "_add_file").click(function(e) {
						interval = setInterval(function() {
							if(!bIframeAdded) return;
							var strValue = $("#" + objThis.strPickerId + "_add_file").attr("value");
							if(strValue != "" && strValue != null && !bFormSubmitted) {
								$("#" + objThis.strPickerId + "_file_form")[0].submit();
								$("#" + objThis.strPickerId + "_file_form").css("display", "none");
								bFormSubmitted = true;
								clearInterval(interval);
								return false;
							}
						}, 200);
					});

					$("#" + objThis.strPickerId + "_file_iframe").load(function(e) {
						var iframe = $("#" + objThis.strPickerId + "_file_iframe").first()[0];
						var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;

						var objESCF = new ESCF();
						objESCF.XMLDoc = (typeof(doc.XMLDocument) == "undefined" ? doc : doc.XMLDocument);
						var arrStatus = objESCF.NodesGetByTagName("swfileupload");
						var bDocLoaded = true;
						try {
							bDocLoaded = typeof(doc.body) == "undefined" || (typeof(doc.body) != "undefined" && doc.body.innerHTML.length > 0);
						} catch(e) {}
						if(bDocLoaded) {
							var bUploadError = true;
							if(arrStatus.length > 0) {
								if(arrStatus[0].GetAttribute("status") == "ok") {
									if(bIframeAdded) {
										$("#" + objThis.strPickerId + "_file_iframe").remove();
										$("#" + objThis.strPickerId + "_file_form").remove();
										bIframeAdded = false;
									}
									var arr = objESCF.NodesGetByTagName("file");
									if(arr.length > 0) {
										bUploadError = false;
										for(var i = 0; i < arr.length; ++i) {
											var strUrl = "";
											strUrl += o.admin_relpath + g_strSdServiceUrl + "?type=resources&cmd=addresource";
											strUrl += "&resourceid=" + encodeURIComponent(arr[i].GetAttribute("relpath"));
											strUrl += "&mimetype=" + encodeURIComponent(arr[i].GetAttribute("mimetype"));
											strUrl += "&url=" + encodeURIComponent(arr[i].GetAttribute("relpath"));
											strUrl += "&width=" + encodeURIComponent(arr[i].GetAttribute("width"));
											strUrl += "&height=" + encodeURIComponent(arr[i].GetAttribute("height"));
											strUrl += "&filesize=" + encodeURIComponent(arr[i].GetAttribute("filesize"));
//$("body").prepend("<textarea style=\"width:200px;height:200px;\">" + strUrl + "</textarea>");
											$.get(strUrl, function(data, strStatus, objHttpXmlRequest) {
												var objESCF = new ESCF();
												objESCF.XMLDoc = objHttpXmlRequest.responseXML;
												var arr = objESCF.NodesGetByTagName("sd_admin_resources_addresource");
												if(arr.length != 1 || arr[0].GetAttribute("status") != "ok") {
													// db update failed...
													alert(g_sd_admin_client_strings.s("dlgrespicker_dbfailed"));
													if(bIframeAdded) {
														$("#" + objThis.strPickerId + "_file_iframe").remove();
														$("#" + objThis.strPickerId + "_file_form").remove();
														bIframeAdded = false;
													}
												} else {
													if(o.restype == "image" && arr[0].GetAttribute("resourcetype") != "1") {
														alert(g_sd_admin_client_strings.s("dlgrespicker_uploadtypemismatch"));
													}
													objThis.strResPickerSearchFor = "";
													$("#" + objThis.strPickerId + "_search").attr("value", "").blur();

													objThis.Fill(o, funcCallbackPick, nImageMargin, nIconWidth);
												}
											});
										}
									}
								}
							}
							if(bUploadError) {
								// file upload failed...
								alert(g_sd_admin_client_strings.s("dlgrespicker_uploadfailed"));
								if(bIframeAdded) {
									$("#" + objThis.strPickerId + "_file_iframe").remove();
									$("#" + objThis.strPickerId + "_file_form").remove();
									bIframeAdded = false;
								}
							}
						}
					});
				}
			});

			return false;
		});

		$("#" + objThis.strPickerId + "_searchform").submit(function(e) {
			objThis.strResPickerSearchFor = $("#" + objThis.strPickerId + "_search").attr("value");
			if(objThis.strResPickerSearchFor == g_sd_admin_client_strings.s("dlgrespicker_defaultsearchtext")) {
				objThis.strResPickerSearchFor = "";
			}
			objThis.Fill(o, nImageMargin, nIconWidth);
			return false;
		});
	}
}
