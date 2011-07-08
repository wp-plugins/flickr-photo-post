<?php
/*
Plugin Name: Flickr Photo Post
Plugin URI: http://www.m-software.de/flickr-photo-post
Description: Add flickr photos to your posts. 
Version: 1.1
Author: Michael Jentsch
Author URI: http://www.m-software.de/

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

*/

define ('WP_FLICKR_PLUGIN_DIR', WP_PLUGIN_DIR . '/flickr-photo-post');
define ('WP_FLICKR_PLUGIN_URL', WP_PLUGIN_URL . '/flickr-photo-post');

/* Plugin nur laden, wenn media-upload.php geöffnet wird */
if ($_SERVER["SCRIPT_NAME"] == "/wp-admin/media-upload.php")
{
	add_filter( 'media_upload_tabs', 'flickr_media_upload_tabs');
	add_action('media_upload_flickr', 'media_upload_flickr');
	add_action('init', 'flickr_init_method');
}

function flickr_init_method() {
    wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', WP_FLICKR_PLUGIN_URL . "/js/jquery.min.js");
    wp_enqueue_script( 'jquery' );

    wp_deregister_script( 'jquery-ui-core' );
    wp_register_script( 'jquery-ui-core', WP_FLICKR_PLUGIN_URL . "/js/jquery-ui.min.js");
    wp_enqueue_script("jquery-ui-core");

    wp_deregister_script( 'jqueryform' );
    wp_register_script( 'jqueryform', WP_FLICKR_PLUGIN_URL . "/js/jquery.form.js");
    wp_enqueue_script( 'jqueryform', array('jquery'));

    wp_deregister_script( 'jqueryflickrform' );
    wp_register_script( 'jqueryflickrform', WP_FLICKR_PLUGIN_URL . "/js/jquery.flickr.js");
    wp_enqueue_script( 'jqueryflickrform', array('jqueryform'));

    wp_deregister_script( 'jquerysimpleslider' );
    wp_register_script( 'jquerysimpleslider', WP_FLICKR_PLUGIN_URL . "/js/jquery.simpleslider.js");
    wp_enqueue_script( 'jquerysimpleslider', array('jquery'));

    wp_deregister_script( 'jqueryjcrop' );
    wp_register_script( 'jqueryjcrop', WP_FLICKR_PLUGIN_URL . "/js/jquery.Jcrop.min.js");
    wp_enqueue_script( 'jqueryjcrop', array('jquery'));

    wp_deregister_script( 'jquerycookie' );
    wp_register_script( 'jquerycookie', WP_FLICKR_PLUGIN_URL . "/js/jquery.cookie.js");
    wp_enqueue_script( 'jquerycookie', array('jquery'));

    wp_deregister_script( 'jquerydump' );
    wp_register_script( 'jquerydump', WP_FLICKR_PLUGIN_URL . "/js/jquery.dump.js");
    wp_enqueue_script( 'jquerydump', array('jquery'));

    wp_register_style( 'flickr-photo-post', WP_FLICKR_PLUGIN_URL . "/css/style.css");
    wp_enqueue_style( 'flickr-photo-post');

    wp_register_style( 'jquery-ui-core', WP_FLICKR_PLUGIN_URL . "/css/jquery-ui.css");
    wp_enqueue_style( 'jquery-ui-core');

    wp_register_style( 'jqueryjcrop', WP_FLICKR_PLUGIN_URL . "/css/jquery.Jcrop.css");
    wp_enqueue_style( 'jqueryjcrop');

    load_plugin_textdomain( 'flickr-photo-post' ,false, dirname( plugin_basename( __FILE__ ) ) );
}    
 

function media_upload_flickr_form() {
    	load_plugin_textdomain( 'flickr-photo-post' ,false, dirname( plugin_basename( __FILE__ ) ) );
	echo media_upload_header();
	require_once WP_FLICKR_PLUGIN_DIR . "/forms/flickr-form.php";
}

function media_upload_flickr() {
	return wp_iframe('media_upload_flickr_form', $errors );
}

function flickr_media_upload_tabs($tabs)
{
	$tabs['flickr'] = "Flickr";
	return($tabs);
}

?>
