function SYS_Archive()
{
	this.strData		= "";
	this.nIndex			= 0;
	this.GetData = function()  			{ return this.strData; }
	this.SetData = function(strData)	{ this.strData = strData; }

	this.LoadBool = function()
	{
		var b = (this.strData.charAt(this.nIndex) == "1" ? true : false);
		this.nIndex++;
		return b;
	}

	this.LoadInt = function()
	{
		var nLen = parseInt(this.strData.substr(this.nIndex, 1));
		this.nIndex++;

		if(nLen == 0) {
			nLen = parseInt(this.strData.substr(this.nIndex, 2));
			this.nIndex += 2;
		}

		var n = parseInt(this.strData.substr(this.nIndex, nLen));
		this.nIndex += nLen;

		return n;
	}

	this.LoadFloat = function()
	{
		var strValue = this.LoadString();
		return parseFloat(strValue);
	}

	this.LoadString = function()
	{
		var nLen = this.LoadInt();
		var strRet = this.strData.substr(this.nIndex, nLen);
		this.nIndex += nLen;
		return strRet;
	}
}
function SearchResult() { 
	this.TitleStyle = "";
	this.DescStyle = "";
	this.DateStyle = "";
	this.Spacing = 0;
	this.MaxHitsPerPage = 0;
	this.NoHits = "";
	this.Next = "";
	this.Previous = "";
	this.HeaderType = "";
	this.HeaderText = "";
	this.HeaderStyle = "";
	this.FooterType = "";
	this.FooterText = "";
	this.FooterStyle = "";

	this.arrMonths = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	this.arrMonthsShort = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
	this.arrWeekDays = new Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
	this.arrWeekDaysShort = new Array("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");

	this.Serialize = function(ar)
	{
		this.Visible = ar.LoadBool();
		this.Alignment = ar.LoadString();
		this.TitleStyle = ar.LoadString();
		this.DescStyle = ar.LoadString();
		this.DateFormat = ar.LoadString();
		this.DateStyle = ar.LoadString();
		this.Spacing = ar.LoadInt();
		this.MaxHitsPerPage = ar.LoadInt();
		this.NoHits = ar.LoadString();
		this.Next = ar.LoadString();
		this.Previous = ar.LoadString();
		this.HeaderType = ar.LoadString();
		this.HeaderText = ar.LoadString();
		this.HeaderStyle = ar.LoadString();
		this.FooterType = ar.LoadString();
		this.FooterText = ar.LoadString();
		this.FooterStyle = ar.LoadString();
	}

	this.LayerWrite = function(strLayer, strHtml)
	{
		if(document.all) {
			document.all[strLayer].innerHTML = strHtml;
		} else {
			if(document.getElementById) {
				document.getElementById(strLayer).innerHTML = strHtml;
			} else {
				var obj = document.layers[strLayer].document;
				obj.open();
				obj.write(strHtml);
				obj.close();
			}
		}
	}

	this.AddZeros = function(str, nCount)
	{
		str = "000000000" + str;
		return str.substr(str.length - nCount);
	}

	this.FormatDate = function(strDate, strFormat)
	{
		var arr = strDate.split(",");
		if(arr.length != 6) return "";
		
		var objDate = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);

		// Assign local variables...
		var strYearFull = objDate.getFullYear() + "";
		var strYear = strYearFull.substr(2);
		var strMonth = (objDate.getMonth() + 1) + "";
		var strDay = objDate.getDate() + "";

		var strHour = objDate.getHours() + "";
		var strHourAMPM = (objDate.getHours() <= 12 ? objDate.getHours() : objDate.getHours() - 12) + ""; 
		var bAM = objDate.getHours() < 12;
		var strMin = objDate.getMinutes() + "";
		var strSec = objDate.getSeconds() + "";
		
		var strWeekDay = objDate.getDay() + "";

		// Replace format-string
		strFormat = strFormat.replace(/%#Y/g,	strYearFull);
		strFormat = strFormat.replace(/%Y/g,	this.AddZeros(strYearFull, 4));
		strFormat = strFormat.replace(/%#y/g,	strYear);	
		strFormat = strFormat.replace(/%y/g,	this.AddZeros(strYear, 2));
		strFormat = strFormat.replace(/%#m/g,	strMonth);	
		strFormat = strFormat.replace(/%m/g,	this.AddZeros(strMonth, 2));	
		strFormat = strFormat.replace(/%#d/g,	strDay);	
		strFormat = strFormat.replace(/%d/g,	this.AddZeros(strDay, 2));	

		strFormat = strFormat.replace(/%#H/g,	strHour);
		strFormat = strFormat.replace(/%H/g,	this.AddZeros(strHour, 2));
		strFormat = strFormat.replace(/%#I/g,	strHourAMPM);
		strFormat = strFormat.replace(/%I/g,	this.AddZeros(strHourAMPM, 2));	
		strFormat = strFormat.replace(/%#M/g,	strMin);	
		strFormat = strFormat.replace(/%M/g,	this.AddZeros(strMin, 2));	
		strFormat = strFormat.replace(/%#S/g,	strSec);
		strFormat = strFormat.replace(/%S/g,	this.AddZeros(strSec, 2));

		strFormat = strFormat.replace(/%#w/g,	strWeekDay);
		strFormat = strFormat.replace(/%w/g,	strWeekDay);

		strFormat = strFormat.replace(/%p/g,	bAM ? "am" : "pm");
		strFormat = strFormat.replace(/%P/g,	bAM ? "AM" : "PM");
		
		strFormat = strFormat.replace(/%A/g,	this.arrWeekDays[(objDate.getDay() + 6) % 7]);	
		strFormat = strFormat.replace(/%a/g,	this.arrWeekDaysShort[(objDate.getDay() + 6) % 7]);	
		strFormat = strFormat.replace(/%B/g,	this.arrMonths[objDate.getMonth()]);	
		strFormat = strFormat.replace(/%b/g,	this.arrMonthsShort[objDate.getMonth()]);
		
		return strFormat;
	}

	this.FormatString = function(strFormat, nHits)
	{
		strFormat = strFormat.replace(/#hits/ig, nHits);
		strFormat = strFormat.replace(/#docs/ig, SYS_SearchResultsGetNum());
		strFormat = strFormat.replace(/#start/ig, this.StartHit + 1);
		strFormat = strFormat.replace(/#end/ig, nHits > (this.StartHit + this.MaxHitsPerPage) ? (this.StartHit + this.MaxHitsPerPage) : nHits);
		strFormat = strFormat.replace(/#searchword/ig, this.SearchForValue);
		
		return strFormat;
	}
	
	this.MakeHtml = function(str)
	{
		var strRet = str;
		strRet = strRet.replace(/&/igm,		"&amp;");
		strRet = strRet.replace(/</igm,		"&lt;");
		strRet = strRet.replace(/>/igm,		"&gt;");
		strRet = strRet.replace(/\"/igm,	"&quot;");
		strRet = strRet.replace(/'/igm,		"&#39;");
		strRet = strRet.replace(/\r/igm,	"");
		strRet = strRet.replace(/\n/igm,	"<br />");
		strRet = strRet.replace(/  /igm,	" &nbsp;");
		return strRet
	}

	this.RenderHeadFoot = function(strCompName, nHits, strRenderType, strTextFormat, strStyle)
	{
		if(strRenderType == "None") return "";

		var nMax = this.MaxHitsPerPage;
		var nPages = parseInt(nHits / nMax) + (nHits % nMax == 0 ? 0 : 1);
		var nCurPage = parseInt(this.StartHit / this.MaxHitsPerPage);
		var strNav = "";
		if(nHits > this.MaxHitsPerPage) {
			if(nCurPage > 0)
				strNav += "<a href=\"javascript:" + strCompName + ".ChangeHits('" + strCompName + "', " + ((nCurPage - 1) * nMax) + ")" + ";\" class=\"" + strStyle + "\">" + this.MakeHtml(this.Previous) + "</a>";
			else
				strNav += this.MakeHtml(this.Previous);
			strNav += "&nbsp;&nbsp;";

			for(var i = 0; i < nPages; i++) {
				var strPageName = i + 1;
				if(i == nCurPage) {
					strNav += "[" + strPageName + "]\r\n";
				} else {
					strNav += "<a href=\"javascript:" + strCompName + ".ChangeHits('" + strCompName + "', " + (i * nMax) + ")" + ";\" class=\"" + strStyle + "\">";
					strNav += strPageName + "</a>\r\n";
				}
			}

			strNav += "&nbsp;&nbsp;";
			if(nCurPage < nPages - 1)
				strNav += "<a href=\"javascript:" + strCompName + ".ChangeHits('" + strCompName + "', " + ((nCurPage + 1) * nMax) + ")" + ";\" class=\"" + strStyle + "\">" + this.MakeHtml(this.Next) + "</a>";
			else
				strNav += this.MakeHtml(this.Next);
		} else {
			strNav = "&nbsp;";
		}
		var strText = this.FormatString(strTextFormat, nHits);

		var arr = strRenderType.split(",");
		if(arr.length != 3) return "";
		
		var strRet = "";
		strRet += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\r\n";
		strRet += "<tr>";
		for(var i = 0; i < arr.length; ++i) {
			var s = arr[i];
			s = s.replace(/-/i, "&nbsp;");
			s = s.replace(/Text/i, strText);
			s = s.replace(/Navigation/i, strNav);
			strRet += "<td class=\"" + strStyle + "\" valign=\"top\" style=\"white-space:nowrap;\" width=\"33%\"";
			if(i == 1) {
				strRet += " align=\"center\">";
				strRet += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\r\n<tr>";
				strRet += "<td class=\"" + strStyle + "\" valign=\"top\" align=\"left\" style=\"white-space:nowrap;\">" + s + "</td>";
				strRet += "</tr></table>";
			} else {	
				strRet += ">" + s;
			}
			strRet += "</td>";
		}
		strRet += "</tr></table>\r\n";

		return strRet;	
	}

	this.RenderHits = function(strCompName)
	{
		if(SYS_SearchResultsGetNum == null || typeof(SYS_SearchResultsGetNum) == "undefined" || this.SearchForValue == "") return;

		var arrHits = new Array();
		for(var i = 0; i < SYS_SearchResultsGetNum(); ++i) {
			if(SYS_SearchResultsGetIndex(i).IsHit())
				arrHits[arrHits.length] = SYS_SearchResultsGetIndex(i);
		}

		var strRet = "";
		if(arrHits.length <= 0) {
			strRet += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\r\n";
			strRet += "<tr>\r\n<td class=\"normal\">";
			strRet += this.MakeHtml(this.FormatString(this.NoHits, 0));
			strRet += "</td></tr>";
			strRet += "</table>\r\n";
		} else{
			var strHeading = this.RenderHeadFoot(strCompName, arrHits.length, this.HeaderType, this.MakeHtml(this.HeaderText), this.HeaderStyle) + "";
			if(strHeading != "")
				strRet += strHeading + "<img src=\"img/swspace.gif\" width=\"1\" height=\"" + this.Spacing + "\" alt=\"\" />";

			strRet += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\r\n";
			strRet += "<tr>\r\n<td valign=\"top\">";
			for(var i = this.StartHit; i < arrHits.length && i < this.StartHit + this.MaxHitsPerPage; i++) {
				var obj = arrHits[i];
				strRet += "<a href=\"" + obj.URL + "\" class=\"" + this.TitleStyle + "\" style=\"display:block;\">" + this.MakeHtml(obj.Title) + "</a>";

				if(obj.Desc != "") {
					strRet += "<p class=\"" + this.DescStyle + "\">" + this.MakeHtml(obj.Desc) + "</p>";
				}
				var strDate = "";
				if(this.DateFormat != "")
					strDate = this.FormatDate(obj.DateModified, this.DateFormat);
				if(strDate != "") {
					strRet += "<p class=\"" + this.DateStyle + "\">" + this.MakeHtml(strDate) + "</p>";
				}
				if(this.Spacing > 0) {
					strRet += "</td>\r\n</tr>\r\n<tr>\r\n<td valign=\"top\"><img src=\"img/swspace.gif\" width=\"1\" height=\"" + this.Spacing + "\" alt=\"\" />";
				}
			}
			strRet += "</td>\r\n</tr>\r\n";
			strRet += "</table>\r\n";
			var strFooter = this.RenderHeadFoot(strCompName, arrHits.length, this.FooterType, this.MakeHtml(this.FooterText), this.FooterStyle);
			if(strFooter != "")
				strRet += "<img src=\"img/swspace.gif\" width=\"1\" height=\"" + this.Spacing + "\" alt=\"\" />" + strFooter;
		}		
		this.LayerWrite(strCompName, strRet);
	}

	this.ChangeHits = function(strCompName, nStart)
	{
		this.StartHit = nStart;
		this.RenderHits(strCompName);
	}
}

function SYS_SearchResultItem(strTitle, strDesc, strDateCreated, strDateModified, strAuthor, strURL)
{
	this.Hit				= false;
	this.Title				= strTitle;
	this.Desc				= strDesc;
	this.DateCreated		= strDateCreated;
	this.DateModified		= strDateModified;
	this.Author				= strAuthor;
	this.URL				= strURL;

	this.IsHit = function()			{ return this.Hit; }
	this.SetHit = function(bHit)	{ this.Hit = bHit; }
}

function SYS_Results()
{
	this.Docs = new Array();
	this.AddDoc = function(strTitle, strDesc, strDateCreated, strDateModified, strAuthor, strURL)	{ this.Docs[this.Docs.length] = new SYS_SearchResultItem(strTitle, strDesc, strDateCreated, strDateModified, strAuthor, strURL); }
}

function SYS_WordItem(strWord, strDocRefBits)
{
	this.Word = strWord;
	this.DocRefBits = strDocRefBits;
}

function SYS_Words()
{
	this.Words = new Array();
	this.AddWord = function(strWord, strDocRefBits){ this.Words[this.Words.length] = new SYS_WordItem(strWord, strDocRefBits); }
	this.Hex = "0123456789ABCDEF";
	
	this.Find = function(strWord)
	{
		reslist = new Array();
		strWord = strWord.toUpperCase();
		for(var i = 0; i < this.Words.length; ++i) {
			if(this.Words[i].Word.indexOf(strWord) != -1) {
				reslist[reslist.length] = this.Words[i];
			}
		}
		return reslist;
	}

	this.AndBitLists = function(str1, str2)
	{
		var strRet = "";
		var nLen = str1.length < str2.length ? str1.length : str2.length;
		for(var i = 0; i < nLen; ++i) {
			strRet += this.Hex.charAt(this.Hex.indexOf(str1.charAt(i)) & this.Hex.indexOf(str2.charAt(i)));
		}
		return strRet;
	}
	this.OrBitLists = function(str1, str2)
	{
		var strRet = "";
		var nLen = str1.length < str2.length ? str1.length : str2.length;
		for(var i = 0; i < nLen; ++i) 
			strRet += this.Hex.charAt(this.Hex.indexOf(str1.charAt(i)) | this.Hex.indexOf(str2.charAt(i)));

		if(str1.length > str2.length) {
			strRet += str1.substr(nLen);
		} else {
			strRet += str2.substr(nLen);
		}
		return strRet;
	}
	
	this.CheckHit = function(strBitList, nIndex)
	{
		var nPos = nIndex / 4;
		if(nPos >= strBitList.length) return false;
		nIndex %= 4;
		var nBit = nIndex == 0 ? 8 : 8 >> nIndex;
		return (this.Hex.indexOf(strBitList.charAt(nPos)) & nBit) != 0;
	}

	this.Serialize = function(ar)
	{
		var nCount = ar.LoadInt();
		for(var i = 0; i < nCount; ++i) {
			var strWord = ar.LoadString().toUpperCase();
			var strBitList = ar.LoadString();
			this.AddWord(strWord, strBitList);
		}
	}	
}
