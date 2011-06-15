/*!
 * Flickr Photo Post
 * version: 1.0 
 * @requires (MIT) jQuery v1.3.2 or later
 * @requires (MIT) jQuery UI 1.8.11 or later 
 * @requires (MIT) jQuery Form v2.67 or later
 * @requires (MIT) Jcrop v.0.9.8 or later
 *
 */

flickrdata = Array ();
selimages = Array ();
flickrLoad = null;
imageCoords = null;
flickrimagecode = "";
image_align = "none";
image_title = "";

$(document).ready(function() { 
	if ($.cookie("flickrImageCounter"))
	{
		flickrImageCounter = $.cookie("flickrImageCounter");
	} else {
		// Cookie not set
		flickrImageCounter = 0;
		$.cookie("flickrImageCounter", flickrImageCounter, { path: '/' });
	}
	var options = { 
			dataType:  'json',
			success:   processJson,
			beforeSubmit: validate};  
	$('#flickrForm').ajaxForm(options);
});

function validate(formData, jqForm, options) { 
    flickrdata['photo']  = Array ();
    if ($("#flupdate").val() == 0)
    {
    	$('#simpleslider').resetSlider();
    }
    for (var i=0; i < formData.length; i++) { 
        if (!formData[i].value) { 
            alert(please_enter_a_search_term);
            return false; 
        } 
    }
    $('#flickrLoad').dialog('open');

    return true; 
} 

function processJson(data) { 
    $('#flickrLoad').dialog('close');
    flickrdata['search'] = data.search;
    flickrdata['page']   = data.page;
    flickrdata['pages']  = data.pages;
    flickrdata['total']  = data.perpage;

    var i = 0;
    for (; i < data.photo.length; i++)
    {
	photos = flickrdata['photo'];
	photos.push (data.photo[i]);
	if ($('#flickrScale').val())
	{
		flickrSize = $('#flickrScale').val();
	} else {
		flickrSize = ".";
	}

	var squareurl = 'http://farm' + data.photo[i].farm + '.static.flickr.com/' + 
			data.photo[i].server + '/' + data.photo[i].id + '_' + data.photo[i].secret+ '_s.jpg';
	var imgurl    = 'http://farm' + data.photo[i].farm + '.static.flickr.com/' + 
			data.photo[i].server + '/' + data.photo[i].id + '_' + data.photo[i].secret + flickrSize + 'jpg';
	$("#simpleslider").append ('<li class="frame" style="display: block; float: left; ">' + 
		'<img width=75 height=75 id="img_' + data.photo[i].id + '" owner="usr_' + data.photo[i].owner + '"' +
		'src="' + squareurl + '" imgurl="' + imgurl + '" title="' + data.photo[i].title + '" >' + '</li>');
	$("#img_" + data.photo[i].id ).mouseover(function() {
		$(this).css('cursor', 'pointer');
	});

	$("#img_" + data.photo[i].id ).click(function() {
		imageCoords = null;
		if ($('#flickrButtons').html().length < 1)
		{
			$('#flickrButtons').html ("<table><tr class='align'>" +
						  "<th valign='top' scope='row' class='label'><label for='attachments[113][align]'>" +
						  "<span class='alignleft'>" + align_text + "</span><br class='clear'></label></th>" +
						  "<td class='field'>" +
						  "<input type='radio' name='image-align' id='image-align-none-113' value='none'>" +
						  "<label for='image-align-none-113' class='align image-align-none-label'>" + align_none_text + "</label>" +
						  "<input type='radio' name='image-align' id='image-align-left-113' value='left' checked='checked'>" +
						  "<label for='image-align-left-113' class='align image-align-left-label'>" + align_left_text + "</label>" +
						  "<input type='radio' name='image-align' id='image-align-center-113' value='center'>" +
						  "<label for='image-align-center-113' class='align image-align-center-label'>" + align_center_text + "</label>" +
						  "<input type='radio' name='image-align' id='image-align-right-113' value='right'>" +
						  "<label for='image-align-right-113' class='align image-align-right-label'>" + align_right_text + "</label></td>" +
						  "</tr></table>" +
						  "<select name='scale' id='flickrScale'>" +
						  "  <option value='_t.'         >100 Pixel " + on_the_longest_side + "</option>" +
						  "  <option value='_m.'         >240 Pixel " + on_the_longest_side + "</option>" +
						  "  <option value='.'  selected >500 Pixel " + on_the_longest_side + "</option>" +
						  "  <option value='_z.'         >640 Pixel " + on_the_longest_side + "</option>" +
						  "</select> &nbsp; " +
						  "<input id='flickrButton' type='button' value='" + insert_into_post + "'>");
			$('#flickrButton').click(function () {
				// Ausrichtung ermitteln
				if ($("#image-align-left-113:checked").val() == "left") { image_align = "left"; }
				if ($("#image-align-right-113:checked").val() == "right") { image_align = "right"; }
				if ($("#image-align-center-113:checked").val() == "center") { image_align = "center"; }
				// Auswahl verarbeiten
				var myx = 0;
				var myy = 0;
				var myw = $("#flickrImage").width();
				var myh = $("#flickrImage").height();
				var mys = 1; // Skalierung
				var mye = 0; // Effekte
				var myu = $('#flickrImage').attr('src');
				if (imageCoords)
				{
					if (imageCoords.w > 0 && imageCoords.h > 0)
					{
						var myx = imageCoords.x;
						var myy = imageCoords.y;
						var myw = imageCoords.w;
						var myh = imageCoords.h;
						var mys = 1; // Skalierung
						var mye = 0; // Effekte
						// MJ
						$('#flickrLoad').dialog('open');
						$.post(flickr_plugin_url + "/api/photo.php", 
							{ "x": myx, "y": myy, "w": myw, "h": myh, "s": mys, "e": mye, "u": myu }, 
							function(data) { 
								if (data)
								{
									if (data.pixelcacheurl)
									{
										// flickrimagecode aktualisieren
										var selectionurl = data.pixelcacheurl;  
										$('#flickrImages').html(flickrimagecode);
										$('#flickrImage').attr('src', selectionurl);
										flickrImageCounter ++;
										$.cookie("flickrImageCounter", flickrImageCounter, { path: '/' });
										$('#flickrImage').attr('class', 'align' + image_align);
										var image_src = $('#flickrImage').attr('src');
										var image_copy = $('#flickrImage').attr('alt');
										var image_caption = $('#flickrImage').attr('title');
										// TODO Sonderzeichen (z.B. ") entfernen
										var flickrimageid = "flickrImage_" + flickrImageCounter;
										$('#flickrImage').attr('id', 'flickrImage_' + flickrImageCounter);
										flickrimagecode = $('#flickrImages').html();
										$('#flickrLoad').dialog('close');
										var wordpressimagecode = "[caption id=\"" + flickrimageid + "\" align=\"align" + image_align + "\" width=\"" + myw + "\"" +
													 " caption=\"" + image_caption + "\"]<a href=\"" + image_copy + "\" rel=\"nofollow\" " +				
									 " target=\"_blank\"><img src=\"" + image_src + "\" width=\"" + myw + "\" height=\"" + myh + "\" />" +
									 "</a>[/caption]";
										top.send_to_editor(wordpressimagecode);
						
						
										top.tb_remove();
									} else {
										$('#flickrLoad').dialog('close');
										// Error handling
										if (data.error)
										{
											if (data.error.internal)
											{
												alert ("Internal Error " + $.dump(data.error.internal));
											} else {
												var errormsg = "";
												if (data.error.x) errormsg += "Error: " + data.error.x + "\r\n";
												if (data.error.y) errormsg += "Error: " + data.error.y + "\r\n";
												if (data.error.w) errormsg += "Error: " + data.error.w + "\r\n";
												if (data.error.h) errormsg += "Error: " + data.error.h + "\r\n";
												if (data.error.e) errormsg += "Error: " + data.error.s + "\r\n";
												if (data.error.s) errormsg += "Error: " + data.error.e + "\r\n";
												alert (errormsg);
											}
										} else {
											alert ("Internal Error: Invalid Response from Pixelcache"); 
										}
									}
								} else {
									alert ("Internal Error: Invalid Response from Pixelcache"); 
								}
							}, 
							"json"
						);

					} else {
						// Ganzes Bild direkt von Flickr (Selektion zurückgenommen)
						flickrImageCounter ++;
						$('#flickrImages').html(flickrimagecode);
						$.cookie("flickrImageCounter", flickrImageCounter, { path: '/' });
						$('#flickrImage').attr('class', 'align' + image_align);
						var image_src = $('#flickrImage').attr('src');
						var image_copy = $('#flickrImage').attr('alt');
						var image_caption = $('#flickrImage').attr('title');
						// TODO Sonderzeichen (z.B. ") entfernen
						var flickrimageid = "flickrImage_" + flickrImageCounter;
						$('#flickrImage').attr('id', 'flickrImage_' + flickrImageCounter);
						flickrimagecode = $('#flickrImages').html();
						var wordpressimagecode = "[caption id=\"" + flickrimageid + "\" align=\"align" + image_align + "\" width=\"" + myw + "\"" +
									 " caption=\"" + image_caption + "\"]<a href=\"" + image_copy + "\" rel=\"nofollow\" " +
									 " target=\"_blank\"><img src=\"" + image_src + "\" width=\"" + myw + "\" height=\"" + myh + "\" />" +
									 "</a>[/caption]";
						top.send_to_editor(wordpressimagecode);
						top.tb_remove();
					}
				} else {
					// Ganzes Bild direkt von Flickr
					flickrImageCounter ++;
					$('#flickrImages').html(flickrimagecode);
					$.cookie("flickrImageCounter", flickrImageCounter, { path: '/' });
					$('#flickrImage').attr('class', 'align' + image_align);
					var image_src = $('#flickrImage').attr('src');
					var image_copy = $('#flickrImage').attr('alt');
					var image_caption = $('#flickrImage').attr('title');
					// TODO Sonderzeichen (z.B. ") entfernen
					var flickrimageid = "flickrImage_" + flickrImageCounter;
					$('#flickrImage').attr('id', flickrimageid);
					flickrimagecode = $('#flickrImages').html();
					var wordpressimagecode = "[caption id=\"" + flickrimageid + "\" align=\"align" + image_align + "\" width=\"" + myw + "\"" +
								 " caption=\"" + image_caption + "\"]<a href=\"" + image_copy + "\" rel=\"nofollow\" " +
								 " target=\"_blank\"><img src=\"" + image_src + "\" width=\"" + myw + "\" height=\"" + myh + "\" />" +
								 "</a>[/caption]";
					top.send_to_editor(wordpressimagecode);
					top.tb_remove();
				}
			});
			$('#flickrScale').change(function() {
				var imgscale = $(this).val();
				// alert ("Rescale to " + imgscale);
				rescale (imgscale);
			});
		}
		var owner = $(this).attr('owner');
		var selimgurl = $(this).attr('imgurl');
		image_title = $(this).attr('title');

		if ( selimages[selimgurl] )
		{
			// aus dem Cache lesen
			$('#flickrLoad').dialog('open');
			flickrimagecode = selimages[selimgurl];
			$('#flickrImages').html(flickrimagecode);
			var imgscale = $('#flickrScale').val();
			rescale (imgscale);
			$('#flickrLoad').dialog('close');
			// $('#flickrImage').Jcrop( { onSelect: selectCoords });
		} else {
			$('#flickrLoad').dialog('open');
			$.ajax({
			   type: "POST",
			   dataType: 'json',
			   url: flickr_plugin_url + "/api/owner.php",
			   data: "owner=" + owner,
			   success: function(msg){
				var title = image_title + " &copy by " + msg.username;
				var copyright = "(Photo &copy by <a target='flickr' href='" + msg.photosurl + "'>" + msg.username + "</a>)";
				var selimghtml = "<img id='flickrImage' src='" + selimgurl + "' title='" + title + "' alt='" + msg.photosurl + "'><br>" + copyright;
				// Daten in den Cache laden
				selimages[selimgurl] = selimghtml;
				flickrimagecode = selimghtml;
				$('#flickrImages').html(flickrimagecode);
				var imgscale = $('#flickrScale').val();
				rescale (imgscale);
				$('#flickrLoad').dialog('close');
				// $('#flickrImage').Jcrop( { onSelect: selectCoords });
			   }
			});
		}
	});
    }

    if (data.photo.length > 0)
    {
	    var showend = 0;
	    for (; i < 6; i++)
	    {
		if (showend == 0)
		{
			$("#simpleslider").append ('<li id="theend" class="frame" style="display: block; float: left; ">' + 
				'<img width=75 height=75 src="' + flickr_plugin_url + '/images/the-end.png"></li>');
			showend = 1;
			// TODO Next Button deaktivieren
		} else {
			$("#simpleslider").append ('<li class="frame" style="display: block; float: left; ">' + 
				'<img width=75 height=75 src="' + flickr_plugin_url + '/images/1pixel.gif"></li>');
		}

	    }
    }
 
    if (data.photo.length == 0)
    {
	// Ende kennzeichnen
	$("#simpleslider").append ('<li class="frame" style="display: block; float: left; width: 530px; text-align:center; line-height:35px;">' +
		no_more_images_matching + ' ' + data.search + '.</li>'); 

    }
}

function appendSlider ()
{
	alert ('appendSlider');
	$('#simpleslider').loadNext();
}

function rescale (imgscale)
{
	// Wegen jcrop
	$('#flickrImages').html(flickrimagecode);
	var scaleimgurl = $('#flickrImage').attr('src');
	var scaleimgurlparts = scaleimgurl.split(".");
	var scaleimgurlpart = "";
	for (var i = 0; i < scaleimgurlparts.length - 1; i++)
	{
		if (i > 0) scaleimgurlpart += '.';
		scaleimgurlpart += scaleimgurlparts[i];
	}
	scaleimgurlparts = scaleimgurlpart.split("_");
	newscaleimgurl = scaleimgurlparts[0] + "_" + scaleimgurlparts[1] + imgscale + "jpg";
	$('#flickrImage').attr('src', newscaleimgurl);
	flickrimagecode = $('#flickrImages').html();
	$('#flickrImage').Jcrop( { onSelect: selectCoords });
}

function selectCoords (coords)
{
	imageCoords = coords;
}

