<center>
<script>
var flickr_plugin_url = "<?=WP_FLICKR_PLUGIN_URL?>";
var insert_into_post = "<?=__( 'Insert into Post')?>";
var please_wait = "<?= __('Please wait...')?>";
var please_enter_a_search_term = "<?=__('Please enter a search term', "flickr-photo-post")?>";
var no_more_images_matching = "<?=__('No more images matching', "flickr-photo-post")?>";
var on_the_longest_side = "<?=__('on the longest side', "flickr-photo-post")?>";

var align_text = "<?=__('Align')?>";
var align_left_text = "<?=__('Left')?>";
var align_center_text = "<?=__('Center')?>";
var align_right_text = "<?=__('Right')?>";
var align_none_text = "<?=__('None')?>";


</script>
<div style='border-bottom:1px solid #DFDFDF;'>
<form id="flickrForm" action="<?=WP_FLICKR_PLUGIN_URL?>/api/flickr.php" method="post">
<table cellspacing='4' style='line-height:30px;'>
<tr><td>
	<?=__("Search", "flickr-photo-post");?>:       
	<input type="hidden" name="flposition" value="1" size="5" id="flposition">
	<input type="hidden" name="flupdate" value="0" id="flupdate">
	<input type="text" name="name" style='width:300px;'>
	<input type="submit" value="<?=__("Search Images", "flickr-photo-post");?>" />
</td></tr>

</table>
</form>
</div>
</center>

<div style='margin-left:25px;margin-top:20px; margin-bottom:20px;'><div style='width:620px;'>
<ul id="simpleslider"></ul>
</div>
</div>

<center>
<div id='flickrButtons'></div>
<div id='flickrImages'></div>
</center>

<div id='flickrLoad'><img src='<?=WP_FLICKR_PLUGIN_URL?>/images/ajax-loader.gif' style='margin-left:35px;'></div>

<script type="text/javascript">

jQuery(function($) {
         $('#simpleslider').simpleslider({
		auto: false,
		speed: 1000,
		previoustext: '<',
		nexttext: '>',
		autobuttonsize: 'false'
	});
 	$('#flickrLoad').dialog({ 
		modal:true, 
		title: please_wait,
		autoOpen: false
	});
});

</script>

