!function(e){e.fn.Huploadify=function(t){var i='<div id="${fileID}" class="uploadify-queue-item"><div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div><span class="up_filename">${fileName}</span><span class="uploadbtn">上传</span><span class="delfilebtn">删除</span></div>',n={fileTypeExts:"",uploader:"",auto:!1,method:"post",multi:!0,formData:null,fileObjName:"file",fileSizeLimit:2048,showUploadedPercent:!0,showUploadedSize:!1,buttonText:"选择文件",removeTimeout:1e3,itemTemplate:i,onUploadStart:null,onUploadSuccess:null,onUploadComplete:null,onUploadError:null,onInit:null,onCancel:null},l=e.extend(n,t),a=function(e,t){return e=e>1048576&&!t?(Math.round(100*e/1048576)/100).toString()+"MB":(Math.round(100*e/1024)/100).toString()+"KB"},o=function(e){for(var t=[],i=e.split(";"),n=0,l=i.length;n<l;n++)t.push(i[n].split(".").pop());return t};this.each(function(){var t=e(this),i=e(".uploadify").length+1,n='<input id="select_btn_'+i+'" class="selectbtn" style="display:none;" type="file" name="fileselect[]"';n+=l.multi?" multiple":"",n+=' accept="',n+=o(l.fileTypeExts).join(","),n+='"/>',n+='<a id="file_upload_'+i+'-button" href="javascript:void(0)" class="uploadify-button">',n+=l.buttonText,n+="</a>";var s='<div id="file_upload_'+i+'-queue" class="uploadify-queue"></div>';t.append(n+s);var r={fileInput:t.find(".selectbtn"),uploadFileList:t.find(".uploadify-queue"),url:l.uploader,fileFilter:[],filter:function(t){var i=[],n=o(l.fileTypeExts);if(n.length>0)for(var s=0,r=t.length;s<r;s++){var p=t[s];parseInt(a(p.size,!0))>l.fileSizeLimit?alert("文件"+p.name+"大小超出限制！"):e.inArray(p.name.split(".").pop(),n)>=0?i.push(p):alert("文件"+p.name+"类型不允许！")}return i},onSelect:function(n){for(var o=0,s=n.length;o<s;o++){var p=n[o],d=e(l.itemTemplate.replace(/\${fileID}/g,"fileupload_"+i+"_"+p.index).replace(/\${fileName}/g,p.name).replace(/\${fileSize}/g,a(p.size)).replace(/\${instanceID}/g,t.attr("id")));if(l.auto&&d.find(".uploadbtn").remove(),this.uploadFileList.append(d),l.showUploadedSize){var u='<span class="progressnum"><span class="uploadedsize">0KB</span>/<span class="totalsize">${fileSize}</span></span>'.replace(/\${fileSize}/g,a(p.size));d.find(".uploadify-progress").after(u)}if(l.showUploadedPercent){var f='<span class="up_percent">0%</span>';d.find(".uploadify-progress").after(f)}l.auto?this.funUploadFile(p):d.find(".uploadbtn").on("click",function(e){return function(){r.funUploadFile(e)}}(p)),d.find(".delfilebtn").on("click",function(e){return function(){r.funDeleteFile(e.index)}}(p))}},onProgress:function(e,n,o){var s=t.find("#fileupload_"+i+"_"+e.index+" .uploadify-progress"),r=(n/o*100).toFixed(2)+"%";l.showUploadedSize&&(s.nextAll(".progressnum .uploadedsize").text(a(n)),s.nextAll(".progressnum .totalsize").text(a(o))),l.showUploadedPercent&&s.nextAll(".up_percent").text(r),s.children(".uploadify-progress-bar").css("width",r)},funGetFiles:function(e){var t=e.target.files;t=this.filter(t);for(var i=0,n=t.length;i<n;i++)this.fileFilter.push(t[i]);return this.funDealFiles(t),this},funDealFiles:function(e){for(var i=t.find(".uploadify-queue .uploadify-queue-item").length,n=0,l=e.length;n<l;n++)e[n].index=++i,e[n].id=e[n].index;return this.onSelect(e),this},funDeleteFile:function(e){for(var n=0,a=this.fileFilter.length;n<a;n++){var o=this.fileFilter[n];if(o.index==e){this.fileFilter.splice(n,1),t.find("#fileupload_"+i+"_"+e).fadeOut(),l.onCancel&&l.onCancel(o);break}}return this},funUploadFile:function(e){var n=!1;try{n=new XMLHttpRequest}catch(a){n=ActiveXobject("Msxml12.XMLHTTP")}if(n.upload){n.upload.addEventListener("progress",function(t){r.onProgress(e,t.loaded,t.total)},!1),n.onreadystatechange=function(a){if(4==n.readyState){if(200==n.status){var o=t.find("#fileupload_"+i+"_"+e.index);o.find(".uploadify-progress-bar").css("width","100%"),l.showUploadedSize&&o.find(".uploadedsize").text(o.find(".totalsize").text()),l.showUploadedPercent&&o.find(".up_percent").text("100%"),l.onUploadSuccess&&l.onUploadSuccess(e,n.responseText),setTimeout(function(){t.find("#fileupload_"+i+"_"+e.index).fadeOut()},l.removeTimeout)}else l.onUploadError&&l.onUploadError(e,n.responseText);l.onUploadComplete&&l.onUploadComplete(e,n.responseText),r.fileInput.val("")}},l.onUploadStart&&l.onUploadStart(),n.open(l.method,this.url,!0),n.setRequestHeader("X-Requested-With","XMLHttpRequest");var o=new FormData;if(o.append(l.fileObjName,e),l.formData)for(key in l.formData)o.append(key,l.formData[key]);n.send(o)}},init:function(){this.fileInput.length>0&&this.fileInput.change(function(e){r.funGetFiles(e)}),t.find(".uploadify-button").on("click",function(){t.find(".selectbtn").trigger("click")}),l.onInit&&l.onInit()}};r.init()})}}(jQuery);