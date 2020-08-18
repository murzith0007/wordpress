var themify_vars = {"version":"2.9.6","url":"http:\/\/localhost\/wordpress\/wordpress\/wp-content\/themes\/elemin\/themify","TB":"1","map_key":null,"includesURL":"http:\/\/localhost\/wordpress\/wordpress\/wp-includes\/","isCached":"on"};
var tbLocalScript = {"isAnimationActive":"1","isParallaxActive":"1","isParallaxScrollActive":"1","animationInviewSelectors":[".module.wow",".themify_builder_content .themify_builder_row.wow",".module_row.wow",".builder-posts-wrap > .post.wow",".fly-in > .post",".fly-in .row_inner > .tb-column",".fade-in > .post",".fade-in .row_inner > .tb-column",".slide-up > .post",".slide-up .row_inner > .tb-column"],"createAnimationSelectors":[],"backgroundSlider":{"autoplay":5000,"speed":2000},"animationOffset":"100","videoPoster":"http:\/\/localhost\/wordpress\/wordpress\/wp-content\/themes\/elemin\/themify\/themify-builder\/img\/blank.png","backgroundVideoLoop":"yes","builder_url":"http:\/\/localhost\/wordpress\/wordpress\/wp-content\/themes\/elemin\/themify\/themify-builder","framework_url":"http:\/\/localhost\/wordpress\/wordpress\/wp-content\/themes\/elemin\/themify","version":"2.9.6","fullwidth_support":"1","fullwidth_container":"body","loadScrollHighlight":"1"};
var themifyScript = {"lightbox":{"lightboxSelector":".themify_lightbox","lightboxOn":true,"lightboxContentImages":false,"lightboxContentImagesSelector":"","theme":"pp_default","social_tools":false,"allow_resize":true,"show_title":false,"overlay_gallery":false,"screenWidthNoLightbox":600,"deeplinking":false,"contentImagesAreas":"","gallerySelector":".gallery-icon > a[href$=jpg],.gallery-icon > a[href$=gif],.gallery-icon > a[href$=png],.gallery-icon > a[href$=JPG],.gallery-icon > a[href$=GIF],.gallery-icon > a[href$=PNG],.gallery-icon > a[href$=jpeg],.gallery-icon > a[href$=JPEG]","lightboxGalleryOn":true},"lightboxContext":"body"};
var tbScrollHighlight = {"fixedHeaderSelector":"","speed":"900","navigation":"#main-nav","scrollOffset":"0"};
/* http://localhost/wordpress/wordpress/wp-content/themes/elemin/themify/js/main.js?ver=2.9.6 */
// tfsmartresize helper
!function(a,b){var c=function(a,b,c){var d;return function(){function g(){c||a.apply(e,f),d=null}var e=this,f=arguments;d?clearTimeout(d):c&&a.apply(e,f),d=setTimeout(g,b||100)}};jQuery.fn[b]=function(a){return a?this.bind("resize",c(a)):this.trigger(b)}}(jQuery,"tfsmartresize");

var Themify, ThemifyGallery;
(function ($, window, document, undefined) {
	'use strict';

	/* window load fires only once in IE */
	window.addEventListener( "load", function () {
		window.loaded = true;
		Themify.triggerEvent( window, 'resize' );
		$( 'body' ).addClass( 'page-loaded' );
	});

	Themify = {
		wow: null,
		triggerEvent: function (a, b) {
			var c;
			document.createEvent ? (c = document.createEvent("HTMLEvents"), c.initEvent(b, !0, !0)) : document.createEventObject && (c = document.createEventObject(), c.eventType = b), c.eventName = b, a.dispatchEvent ? a.dispatchEvent(c) : a.fireEvent && htmlEvents["on" + b] ? a.fireEvent("on" + c.eventType, c) : a[b] ? a[b]() : a["on" + b] && a["on" + b]()
		},
		Init: function () {
			if (typeof tbLocalScript !== 'undefined' && tbLocalScript) {
				var $self = Themify;
				$(document).ready(function () {
					tbLocalScript.isTouch = $('body').hasClass('touch');
					$self.LoadAsync(tbLocalScript.builder_url + '/js/themify.builder.script.js'); // this script should be always loaded even there is no builder content because it's also requires for themify_shortcode for exp: animation js
				});
				$('body').on('builderscriptsloaded.themify', function () {
					$self.LoadAsync(tbLocalScript.builder_url + '/js/themify.builder.script.js');
				});
			}
			else {
				this.bindEvents();
			}
		},
		bindEvents: function () {
			var $self = Themify;
			if (window.loaded) {
				$('.shortcode.slider, .shortcode.post-slider, .slideshow-wrap').css({'height': 'auto', 'visibility': 'visible'});
				$self.InitCarousel();
				$self.InitGallery();
				$self.InitMap();
				$self.wowInit();
				$self.loadTFIcons();
			}
			else {
				$(window).load(function () {
					$('.shortcode.slider, .shortcode.post-slider, .slideshow-wrap').css({'height': 'auto', 'visibility': 'visible'});
					$self.InitGallery();
				});
				$(document).ready(function () {
					$self.InitCarousel();
					$self.InitMap();
					$self.wowInit();
					$self.loadTFIcons();
				});
			}
			$('body').on('builder_load_module_partial builder_toggle_frontend', this.InitMap); // builder toggle/update module map.
		},
		loadTFIcons : function() {
			if( $( 'span[class*="ti-"], i[class*="ti-"]' ).length ) {
				this.LoadCss(themify_vars.url + '/themify-icons/themify-icons.css', null);
			}
		},
		InitCarousel: function () {
			if ($('.slides[data-slider]').length > 0) {
				var $self = this;
				$self.LoadAsync(themify_vars.url + '/js/jquery.imagesloaded.min.js', function () {
						if('undefined' === typeof $.fn.carouFredSel){
							$self.LoadAsync(themify_vars.url + '/js/carousel.js', $self.carouselCalback, null, null, function () {
								return ('undefined' !== typeof $.fn.carouFredSel);
							});
						}
						else{
							$self.carouselCalback();
						}
				}, null, null, function () {
					return ('undefined' !== typeof $.fn.imagesLoaded);
				});
			}
		},
		carouselCalback: function () {

			$('.slides[data-slider]').each(function () {
				$(this).find("> br, > p").remove();
				var $this = $(this),
						$data = JSON.parse(window.atob($(this).data('slider'))),
						height = (typeof $data.height === 'undefined') ? 'auto' : $data.height,
						$numsldr = $data.numsldr,
						$slideContainer = 'undefined' !== typeof $data.custom_numsldr ? '#' + $data.custom_numsldr : '#slider-' + $numsldr,
						$speed = $data.speed >= 1000 ? $data.speed : 1000 * $data.speed,
						$args = {
							responsive: true,
							swipe: true,
							circular: $data.wrapvar,
							infinite: $data.wrapvar,
							auto: {
								play: $data.auto == 0 ? false : true,
								timeoutDuration: $data.auto >= 1000 ? $data.auto : 1000 * $data.auto,
								duration: $speed,
								pauseOnHover: $data.pause_hover
							},
							scroll: {
								items: parseInt($data.scroll),
								duration: $speed,
								fx: $data.effect
							},
							items: {
								visible: {
									min: 1,
									max: parseInt($data.visible)
								},
								width: 120,
								height: height
							},
							onCreate: function (items) {
								$this.closest('.caroufredsel_wrapper').outerHeight($this.outerHeight(true));
								$($slideContainer).css({'visibility': 'visible', 'height': 'auto'});
							}
						};
				if ($data.slider_nav) {
					$args.prev = $slideContainer + ' .carousel-prev';
					$args.next = $slideContainer + ' .carousel-next';
				}
				if ($data.pager) {
					$args.pagination = $slideContainer + ' .carousel-pager';
				}
				$this.imagesLoaded().always(function () {
					$this.carouFredSel($args);
				});
			});

			var tscpsDidResize = false;
			$(window).on("resize", function () {
				tscpsDidResize = true;
			});
			setInterval(function () {
				if (tscpsDidResize) {
					tscpsDidResize = false;
					$(".slides[data-slider]").each(function () {
						var heights = [],
								newHeight,
								$self = $(this);
						$self.find("li").each(function () {
							heights.push($(this).outerHeight(true));
						});
						newHeight = Math.max.apply(Math, heights);
						$self.outerHeight(newHeight);
						$self.parent().outerHeight(newHeight);
					});
				}
			}, 500);

		},
		InitMap: function () {
			var $self = Themify;
			if ($('.themify_map').length > 0) {
				if (typeof google !== 'object' || typeof google.maps !== 'object') {
					if(!themify_vars.map_key){
						themify_vars.map_key = '';
					}
					$self.LoadAsync('//maps.googleapis.com/maps/api/js?v=3.exp&callback=Themify.MapCallback&key='+themify_vars.map_key, false, true, true);
				} else {
					if( themify_vars.isCached && themify_vars.isCached === 'enable' ) {
						google.maps = { __gjsload__: function() { return; } };
						$self.LoadAsync('//maps.googleapis.com/maps/api/js?v=3.exp&callback=Themify.MapCallback&key='+themify_vars.map_key, false, true, true);
					} else {
						$self.MapCallback();
					}
				}
			}
		},
		MapCallback: function () {
			var $maps = $('.themify_map');
			$maps.each(function ($i) {
				var $data = JSON.parse(window.atob($(this).data('map'))),
						address = $data.address,
						zoom = parseInt($data.zoom),
						type = $data.type,
						scroll = $data.scroll,
						drag = $data.drag,
						node = this;
				var delay = $i * 1000;
				setTimeout(function () {
					var geo = new google.maps.Geocoder(),
						latlng = new google.maps.LatLng(-34.397, 150.644),
						mapOptions = {
							zoom: zoom,
							center: latlng,
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							scrollwheel: scroll,
							draggable: drag
						};
					switch (type.toUpperCase()) {
						case 'ROADMAP':
							mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
							break;
						case 'SATELLITE':
							mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
							break;
						case 'HYBRID':
							mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
							break;
						case 'TERRAIN':
							mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
							break;
					}

					var map = new google.maps.Map(node, mapOptions),
							revGeocoding = $(node).data('reverse-geocoding') ? true : false;

					google.maps.event.addListenerOnce( map, 'idle', function(){
						$( 'body' ).trigger( 'themify_map_loaded', [ $(node), map ] );
					});

					/* store a copy of the map object in the dom node, for future reference */
					$(node).data( 'gmap_object', map );

					if (revGeocoding) {
						var latlngStr = address.split(',', 2),
								lat = parseFloat(latlngStr[0]),
								lng = parseFloat(latlngStr[1]),
								geolatlng = new google.maps.LatLng(lat, lng),
								geoParams = {'latLng': geolatlng};
					} else {
						var geoParams = {'address': address};
					}

					geo.geocode(geoParams, function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							var position = revGeocoding ? geolatlng : results[0].geometry.location;
							map.setCenter(position);
							var marker = new google.maps.Marker({
								map: map,
								position: position
							}),
							info = $(node).data('info-window');
							if (undefined !== info) {
								var contentString = '<div class="themify_builder_map_info_window">' + info + '</div>',
									infowindow = new google.maps.InfoWindow({
										content: contentString
									});

								google.maps.event.addListener(marker, 'click', function () {
									infowindow.open(map, marker);
								});
							}
						}
					});
				}, delay);
			});
		},
		wowInit: function () {
                    if ((typeof tbLocalScript === 'undefined' || !tbLocalScript) || (typeof tbLocalScript.animationInviewSelectors!=='undefined' && tbLocalScript.animationInviewSelectors.length > 0)) {
                            if (!Themify.wow) {
                                    Themify.LoadAsync(themify_vars.url + '/js/wow.js', Themify.wowCallback, null, null, function () {
                                            return (Themify.wow);
                                    });
                            }
                            else {
                                    Themify.wowCallback();
                                    return (Themify.wow);
                            }
                    }
		},
		wowCallback: function () {
			var self = Themify;
			if (themify_vars.TB) {
				ThemifyBuilderModuleJs.animationOnScroll();
			}
			self.wow = new WOW({
				live: true,
				offset: typeof tbLocalScript !== 'undefined' && tbLocalScript ? parseInt(tbLocalScript.animationOffset) : 100
			});
			self.wow.init();

			$('body').on('builder_load_module_partial builder_toggle_frontend', function () {
				self.wow.doSync();
				self.wow.sync();
			});

			// duck-punching WOW to get delay and iteration from classnames
			if (typeof self.wow.__proto__ !== 'undefined') {
				self.wow.__proto__.applyStyle = function (box, hidden) {
					var delay, duration, iteration;
					duration = box.getAttribute('data-wow-duration');
					delay = box.getAttribute('class').match(/animation_effect_delay_((?:\d+\.?\d*|\.\d+))/);
					if (null != delay)
						delay = delay[1] + 's';
					iteration = box.getAttribute('class').match(/animation_effect_repeat_(\d*)/);
					if (null != iteration)
						iteration = iteration[1];
					return this.animate((function (_this) {
						return function () {
							return _this.customStyle(box, hidden, duration, delay, iteration);
						};
					})(this));
				};
			}
		},
		LoadAsync: function (src, callback, version, defer, test) {
			var id = src.split("/").pop().replace(/\./g, '_'), // Make script filename as ID
					existElemens = document.getElementById(id);

			if (existElemens) {
				if (callback) {
					if (test) {
						var callbackTimer = setInterval(function () {
							var call = false;
							try {
								call = test.call();
							} catch (e) {
							}

							if (call) {
								clearInterval(callbackTimer);
								callback.call();
							}
						}, 100);
					} else {
						setTimeout(callback, 110);
					}
				}
				return;
			}
			var s, r, t;
			r = false;
			s = document.createElement('script');
			s.type = 'text/javascript';
			s.id = id;
			s.src = !version && 'undefined' !== typeof tbLocalScript ? src + '?version=' + tbLocalScript.version : src;
			if (!defer) {
				s.async = true;
			}
			else {
				s.defer = true;
			}
			s.onload = s.onreadystatechange = function () {
				if (!r && (!this.readyState || this.readyState === 'complete'))
				{
					r = true;
					if (callback) {
						callback();
					}
				}
			};
			t = document.getElementsByTagName('script')[0];
			t.parentNode.insertBefore(s, t);
		},
		LoadCss: function (href, version, before, media) {

			if ($("link[href='" + href + "']").length > 0) {
				return;
			}
			var doc = window.document;
			var ss = doc.createElement("link");
			var ref;
			if (before) {
				ref = before;
			}
			else {
				var refs = (doc.body || doc.getElementsByTagName("head")[ 0 ]).childNodes;
				ref = refs[ refs.length - 1];
			}

			var sheets = doc.styleSheets;
			ss.rel = "stylesheet";
			ss.href = version ? href + '?version=' + version : href;
			// temporarily set media to something inapplicable to ensure it'll fetch without blocking render
			ss.media = "only x";
			ss.async = 'async';

			// Inject link
			// Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
			ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
			// A method (exposed on return object for external use) that mimics onload by polling until document.styleSheets until it includes the new sheet.
			var onloadcssdefined = function (cb) {
				var resolvedHref = ss.href;
				var i = sheets.length;
				while (i--) {
					if (sheets[ i ].href === resolvedHref) {
						return cb();
					}
				}
				setTimeout(function () {
					onloadcssdefined(cb);
				});
			};

			// once loaded, set link's media back to `all` so that the stylesheet applies once it loads
			ss.onloadcssdefined = onloadcssdefined;
			onloadcssdefined(function () {
				ss.media = media || "all";
			});
			return ss;
		},
		video: function () {
			if ($('.themify_video_desktop a').length > 0) {
				if (typeof flowplayer === 'undefined') {
					this.LoadAsync(themify_vars.url + '/js/flowplayer-3.2.4.min.js', this.videoCalback);
				}
				else {
					this.videoCalback();
				}
			}
		},
		videoCalback: function () {
			$('.themify_video_desktop a').each(function () {
				flowplayer(
					$(this).attr('id'),
					themify_vars.url + "/js/flowplayer-3.2.5.swf",
					{
						clip: {autoPlay: false}
					}
				);
			});
		},
		lightboxCallback: function ($el, $args) {
			this.LoadAsync(themify_vars.url + '/js/themify.gallery.js', function () {
				Themify.GalleryCallBack($el, $args);
			}, null, null, function () {
				return ('undefined' !== typeof ThemifyGallery);
			});
		},
		InitGallery: function ($el, $args) {
			var lightboxConditions = typeof themifyScript === 'object' && ((themifyScript.lightbox.lightboxContentImages && $(themifyScript.lightbox.contentImagesAreas).length>0) || $(themifyScript.lightbox.lightboxSelector).length > 0);
                            if(!lightboxConditions){
                                    lightboxConditions = typeof themifyScript === 'object' && themifyScript.lightbox.lightboxGalleryOn && ($(themifyScript.lightbox.lightboxContentImagesSelector).length > 0 || (typeof themifyScript.lightbox.gallerySelector!=='undefined' && $(themifyScript.lightbox.gallerySelector).length > 0));
                            }
			var self = this;
			if (lightboxConditions || $('.module.module-gallery').length > 0 || $('.module.module-image').length > 0) {
				this.LoadCss(themify_vars.url + '/css/lightbox.css', null);
				this.LoadAsync(themify_vars.url + '/js/lightbox.js', function () {
					Themify.lightboxCallback($el, $args);
				}, null, null, function () {
					return ('undefined' !== typeof $.fn.magnificPopup);
				});
				
				if( $( '.gallery-masonry' ).length ) {
					this.LoadAsync(themify_vars.includesURL + 'js/imagesloaded.min.js', function () {
						self.LoadAsync(themify_vars.includesURL + 'js/masonry.min.js', function () {
							$( '.gallery-masonry' ).imagesLoaded(function() {
								$( '.gallery-masonry' ).masonry({
									itemSelector: '.gallery-item',
									columnWidth: 1,
									originLeft : ! $( 'body' ).hasClass( 'rtl' )
								}); 
							});
						}, null, null, function () {
							return ('undefined' !== typeof $.fn.masonry);
						});
					}, null, null, function () {
						return ('undefined' !== typeof $.fn.imagesLoaded);
					});
				}
			} else {
				$('body').addClass('themify_lightbox_loaded').removeClass('themify_lightboxed_images');
			}
		},
		GalleryCallBack: function ($el, $args) {
			if (!$el) {
				$el = $(themifyScript.lightboxContext);
			}
			$args = !$args && themifyScript.extraLightboxArgs ? themifyScript.extraLightboxArgs : {};
			ThemifyGallery.init({'context': $el, 'extraLightboxArgs': $args});
			$('body').addClass('themify_lightbox_loaded').removeClass('themify_lightboxed_images');
		},
		isPageHasBuilderContent: function () {
			var check_builder = $('.themify_builder_content').filter(function () {
				return $.trim($(this).html().toString()).length > 0;
			});
			return check_builder.length;
		}
	};

	Themify.Init();

}(jQuery, window, document));
var countVars = {"disqusShortname":"coffee-doll"};
/* http://localhost/wordpress/wordpress/wp-content/plugins/disqus-comment-system/public/js/comment_count.js?ver=3.0.17 */
var disqus_shortname = countVars.disqusShortname;
(function () {
    var nodes = document.getElementsByTagName('span');
    for (var i = 0, url; i < nodes.length; i++) {
        if (nodes[i].className.indexOf('dsq-postid') != -1 && nodes[i].parentNode.tagName == 'A') {
            nodes[i].parentNode.setAttribute('data-disqus-identifier', nodes[i].getAttribute('data-dsqidentifier'));
            url = nodes[i].parentNode.href.split('#', 1);
            if (url.length == 1) { url = url[0]; }
            else { url = url[1]; }
            nodes[i].parentNode.href = url + '#disqus_thread';
        }
    }
    var s = document.createElement('script');
    s.async = true;
    s.type = 'text/javascript';
    s.src = 'https://' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
}());

var embedVars = {"disqusConfig":{"integration":"wordpress 3.0.17"},"disqusIdentifier":"464 http:\/\/localhost\/wordpress\/wordpress\/keurig-k-elite-coffee-maker-single-serve-k-cup-pod-coffee-brewer-with-iced-coffee-capability-brushed-silver\/","disqusShortname":"coffee-doll","disqusTitle":"Keurig K-Elite Coffee Maker, Single Serve K-Cup Pod Coffee Brewer, With Iced Coffee Capability, Brushed Silver","disqusUrl":"http:\/\/localhost\/wordpress\/wordpress\/keurig-k-elite-coffee-maker-single-serve-k-cup-pod-coffee-brewer-with-iced-coffee-capability-brushed-silver\/","postId":"464"};
/* http://localhost/wordpress/wordpress/wp-content/plugins/disqus-comment-system/public/js/comment_embed.js?ver=3.0.17 */
var disqus_url = embedVars.disqusUrl;
var disqus_identifier = embedVars.disqusIdentifier;
var disqus_container_id = 'disqus_thread';
var disqus_shortname = embedVars.disqusShortname;
var disqus_title = embedVars.disqusTitle;
var disqus_config_custom = window.disqus_config;
var disqus_config = function () {
    /*
    All currently supported events:
    onReady: fires when everything is ready,
    onNewComment: fires when a new comment is posted,
    onIdentify: fires when user is authenticated
    */
    var dsqConfig = embedVars.disqusConfig;
    this.page.integration = dsqConfig.integration;
    this.page.remote_auth_s3 = dsqConfig.remote_auth_s3;
    this.page.api_key = dsqConfig.api_key;
    this.sso = dsqConfig.sso;
    this.language = dsqConfig.language;

    if (disqus_config_custom)
        disqus_config_custom.call(this);
};

(function() {
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();

var themifyScript = {"lightbox":{"lightboxSelector":".themify_lightbox","lightboxOn":true,"lightboxContentImages":false,"lightboxContentImagesSelector":"","theme":"pp_default","social_tools":false,"allow_resize":true,"show_title":false,"overlay_gallery":false,"screenWidthNoLightbox":600,"deeplinking":false,"contentImagesAreas":"","gallerySelector":".gallery-icon > a[href$=jpg],.gallery-icon > a[href$=gif],.gallery-icon > a[href$=png],.gallery-icon > a[href$=JPG],.gallery-icon > a[href$=GIF],.gallery-icon > a[href$=PNG],.gallery-icon > a[href$=jpeg],.gallery-icon > a[href$=JPEG]","lightboxGalleryOn":true},"lightboxContext":"#pagewrap"};
/* http://localhost/wordpress/wordpress/wp-content/themes/elemin/js/themify.script.js?ver=5.5 */
;// Themify Theme Scripts - http://themify.me/

jQuery(document).ready(function($){

	/////////////////////////////////////////////
	// Scroll to top 							
	/////////////////////////////////////////////
	$('.back-top a').click(function () {
            $('body,html').animate({scrollTop: 0}, 800);
            return false;
	});

	/////////////////////////////////////////////
	// Toggle menu on mobile 							
	/////////////////////////////////////////////
	$("#menu-icon").click(function(){
            $("#headerwrap #main-nav").fadeToggle();
            $("#headerwrap #searchform").hide();
            $(this).toggleClass("active");
	});

	/////////////////////////////////////////////
	// Toggle searchform on mobile 							
	/////////////////////////////////////////////
	$("#search-icon").click(function(){
            $("#headerwrap #searchform").fadeToggle();
            $("#headerwrap #main-nav").hide();
            $('#headerwrap #s').focus();
            $(this).toggleClass("active");
	});

	if( $( 'body' ).hasClass( 'touch' ) && typeof jQuery.fn.themifyDropdown != 'function' ) {
		Themify.LoadAsync(themify_vars.url + '/js/themify.dropdown.js', function(){
			$( '#main-nav' ).themifyDropdown();
		});
	}
});
/* http://localhost/wordpress/wordpress/wp-includes/js/comment-reply.min.js?ver=5.5 */
/*! This file is auto-generated */
window.addComment=function(p){var f,v,I,C=p.document,h={commentReplyClass:"comment-reply-link",commentReplyTitleId:"reply-title",cancelReplyId:"cancel-comment-reply-link",commentFormId:"commentform",temporaryFormId:"wp-temp-form-div",parentIdFieldId:"comment_parent",postIdFieldId:"comment_post_ID"},e=p.MutationObserver||p.WebKitMutationObserver||p.MozMutationObserver,i="querySelector"in C&&"addEventListener"in p,n=!!C.documentElement.dataset;function t(){r(),function(){if(!e)return;new e(o).observe(C.body,{childList:!0,subtree:!0})}()}function r(e){if(i&&(f=E(h.cancelReplyId),v=E(h.commentFormId),f)){f.addEventListener("touchstart",l),f.addEventListener("click",l);var t=function(e){if((e.metaKey||e.ctrlKey)&&13===e.keyCode)return v.removeEventListener("keydown",t),e.preventDefault(),v.submit.click(),!1};v&&v.addEventListener("keydown",t);for(var n,r=function(e){var t,n=h.commentReplyClass;e&&e.childNodes||(e=C);t=C.getElementsByClassName?e.getElementsByClassName(n):e.querySelectorAll("."+n);return t}(e),o=0,d=r.length;o<d;o++)(n=r[o]).addEventListener("touchstart",a),n.addEventListener("click",a)}}function l(e){var t=E(h.temporaryFormId);if(t&&I){E(h.parentIdFieldId).value="0";var n=t.textContent;t.parentNode.replaceChild(I,t),this.style.display="none";var r=E(h.commentReplyTitleId),o=r&&r.firstChild;o&&o.nodeType===Node.TEXT_NODE&&n&&(o.textContent=n),e.preventDefault()}}function a(e){var t=E(h.commentReplyTitleId),n=t&&t.firstChild.textContent,r=this,o=m(r,"belowelement"),d=m(r,"commentid"),i=m(r,"respondelement"),l=m(r,"postid"),a=m(r,"replyto")||n;o&&d&&i&&l&&!1===p.addComment.moveForm(o,d,i,l,a)&&e.preventDefault()}function o(e){for(var t=e.length;t--;)if(e[t].addedNodes.length)return void r()}function m(e,t){return n?e.dataset[t]:e.getAttribute("data-"+t)}function E(e){return C.getElementById(e)}return i&&"loading"!==C.readyState?t():i&&p.addEventListener("DOMContentLoaded",t,!1),{init:r,moveForm:function(e,t,n,r,o){var d=E(e);I=E(n);var i,l,a,m=E(h.parentIdFieldId),c=E(h.postIdFieldId),s=E(h.commentReplyTitleId),u=s&&s.firstChild;if(d&&I&&m){void 0===o&&(o=u&&u.textContent),function(e){var t=h.temporaryFormId,n=E(t),r=E(h.commentReplyTitleId),o=void 0!==r?r.firstChild.textContent:"";if(n)return;(n=C.createElement("div")).id=t,n.style.display="none",n.textContent=o,e.parentNode.insertBefore(n,e)}(I),r&&c&&(c.value=r),m.value=t,f.style.display="",d.parentNode.insertBefore(I,d.nextSibling),u.nodeType===Node.TEXT_NODE&&(u.textContent=o),f.onclick=function(){return!1};try{for(var y=0;y<v.elements.length;y++)if(i=v.elements[y],l=!1,"getComputedStyle"in p?a=p.getComputedStyle(i):C.documentElement.currentStyle&&(a=i.currentStyle),(i.offsetWidth<=0&&i.offsetHeight<=0||"hidden"===a.visibility)&&(l=!0),"hidden"!==i.type&&!i.disabled&&!l){i.focus();break}}catch(e){}return!1}}}}(window);
/* http://localhost/wordpress/wordpress/wp-includes/js/wp-embed.min.js?ver=5.5 */
/*! This file is auto-generated */
!function(d,l){"use strict";var e=!1,o=!1;if(l.querySelector)if(d.addEventListener)e=!0;if(d.wp=d.wp||{},!d.wp.receiveEmbedMessage)if(d.wp.receiveEmbedMessage=function(e){var t=e.data;if(t)if(t.secret||t.message||t.value)if(!/[^a-zA-Z0-9]/.test(t.secret)){var r,a,i,s,n,o=l.querySelectorAll('iframe[data-secret="'+t.secret+'"]'),c=l.querySelectorAll('blockquote[data-secret="'+t.secret+'"]');for(r=0;r<c.length;r++)c[r].style.display="none";for(r=0;r<o.length;r++)if(a=o[r],e.source===a.contentWindow){if(a.removeAttribute("style"),"height"===t.message){if(1e3<(i=parseInt(t.value,10)))i=1e3;else if(~~i<200)i=200;a.height=i}if("link"===t.message)if(s=l.createElement("a"),n=l.createElement("a"),s.href=a.getAttribute("src"),n.href=t.value,n.host===s.host)if(l.activeElement===a)d.top.location.href=t.value}}},e)d.addEventListener("message",d.wp.receiveEmbedMessage,!1),l.addEventListener("DOMContentLoaded",t,!1),d.addEventListener("load",t,!1);function t(){if(!o){o=!0;var e,t,r,a,i=-1!==navigator.appVersion.indexOf("MSIE 10"),s=!!navigator.userAgent.match(/Trident.*rv:11\./),n=l.querySelectorAll("iframe.wp-embedded-content");for(t=0;t<n.length;t++){if(!(r=n[t]).getAttribute("data-secret"))a=Math.random().toString(36).substr(2,10),r.src+="#?secret="+a,r.setAttribute("data-secret",a);if(i||s)(e=r.cloneNode(!0)).removeAttribute("security"),r.parentNode.replaceChild(e,r)}}}}(window,document);
var fifuImageVars = {"fifu_lazy":"","fifu_woo_lbox_enabled":"1","fifu_woo_zoom":"inline","fifu_is_product":""};
/* http://localhost/wordpress/wordpress/wp-content/plugins/featured-image-from-url/includes/html/js/image.js?ver=3.2.4 */
jQuery(document).ready(function ($) {
    // lazy load
    if (fifuImageVars.fifu_lazy)
        fifu_lazy();

    // woocommerce lightbox/zoom
    disableClick($);
    disableLink($);

    // for all images at single product page
    setTimeout(function () {
        resizeImg($);
        jQuery('a.woocommerce-product-gallery__trigger').css('visibility', 'visible');
    }, 2500);

    // zoomImg
    setTimeout(function () {
        jQuery('img.zoomImg').css('z-index', '');
    }, 1000);
});

jQuery(window).on('ajaxComplete', function () {
    if (fifuImageVars.fifu_lazy)
        fifu_lazy();
});

// fix space between product image and gallery caused by lazy load
if (fifuImageVars.fifu_is_product) {
    jQuery('img[fifu-featured="1"]').on('load', function () {
        mainImage = jQuery('.flex-viewport').find('img[fifu-featured="1"]')[0];
        if (mainImage)
            jQuery('.flex-viewport').css('height', mainImage.clientHeight + 'px');
    });
}

function resizeImg($) {
    var imgSelector = ".post img, .page img, .widget-content img, .product img, .wp-admin img, .tax-product_cat img, .fifu img";
    var resizeImage = function (sSel) {
        jQuery(sSel).each(function () {
            //original size
            var width = $(this)['0'].naturalWidth;
            var height = $(this)['0'].naturalHeight;

            //100%
            var ratio = width / height;
            jQuery(this).attr('data-large_image_width', jQuery(window).width() * ratio);
            jQuery(this).attr('data-large_image_height', jQuery(window).width());
        });
    };
    resizeImage(imgSelector);
}

function disableClick($) {
    if (!fifuImageVars.fifu_woo_lbox_enabled) {
        firstParentClass = '';
        parentClass = '';
        jQuery('figure.woocommerce-product-gallery__wrapper').find('div.woocommerce-product-gallery__image').each(function (index) {
            parentClass = jQuery(this).parent().attr('class').split(' ')[0];
            if (!firstParentClass)
                firstParentClass = parentClass;

            if (parentClass != firstParentClass)
                return false;

            jQuery(this).children().click(function () {
                return false;
            });
            jQuery(this).children().children().css("cursor", "default");
        });
    }
}

function disableLink($) {
    if (!fifuImageVars.fifu_woo_lbox_enabled) {
        firstParentClass = '';
        parentClass = '';
        jQuery('figure.woocommerce-product-gallery__wrapper').find('div.woocommerce-product-gallery__image').each(function (index) {
            parentClass = jQuery(this).parent().attr('class').split(' ')[0];
            if (!firstParentClass)
                firstParentClass = parentClass;

            if (parentClass != firstParentClass)
                return false;

            jQuery(this).children().attr("href", "");
        });
    }
}

