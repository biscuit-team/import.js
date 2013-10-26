/**
 * Created by shigong on 13-10-25.
 */

/**
 * This util is to dynamically import html page in client side, just like <c:import/> tag in jsp.
 *
 * usage:
 * <script src="js/import.js" data-url="target_page.html"></script>
 *
 * the content of target_page.html will replace the script tag itself when remote page load complete
 *
 * this process is synchronized.
 *
 */
(function () {
	"use strict";

	/**
	 * set base url of outside page.
	 * @param {string|false} base_url the url to set. false to remove <base/> tag
	 * @private
	 */
	function _set_base(base_url) {

		var bases = document.getElementsByTagName('base');

		if (base_url) {
			if (bases.length > 0) {
				bases[0].href = base_url;
			} else {
				var new_base_element = document.createElement('base');
				new_base_element.href = base_url;
				document.getElementsByTagName('head')[0].appendChild(new_base_element);
			}
		} else {
			if (bases.length > 0) {
				bases[0].parentElement.removeChild(bases[0]);
			}
		}
	}

	/**
	 * @returns {string|false}
	 * @private
	 */
	function _get_base_url() {
		var bases = document.getElementsByTagName('base');
		return bases.length > 0 ? bases[0].href : false;
	}

	function _get_dir(url) {

		if (url.lastIndexOf('/') === url.length - 1) {
			return url;
		} else {
			var paths = url.split('/');
			paths.pop();
			return paths.join('/') + '/';
		}


	}

	/**
	 * @param base_url
	 * @param relative_url
	 * @returns {string} a new absolute url of the relative_url based on base_url
	 * @private
	 */
	function _rebase_url(base_url, relative_url) {
		if (_is_relative(relative_url)) {
			return _get_dir(base_url) + relative_url;
		} else {
			return relative_url;
		}
	}

	/**
	 * @param url
	 * @returns {boolean} if the url is relative
	 * @private
	 */
	function _is_relative(url) {
		return url.indexOf('/') != 0 && url.indexOf('://') < 0;
	}

	function __main() {
		/**
		 * original base url of outside page.
		 */
		var origin_base;
		var script_list = document.getElementsByTagName('script');

		var url;
		for (var index = script_list.length - 1; index > -1; index++) {

			var c_script = script_list[index];

			url = c_script.getAttribute('data-url');
			if (url) {

				origin_base = _get_base_url();
				var new_base_url = _rebase_url(origin_base ? origin_base : location.href, _get_dir(url));
				c_script.parentNode.removeChild(c_script);
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("GET", url, false);
				xmlHttp.send(null);

				_set_base(new_base_url);
				console.log(new_base_url);

				document.write(xmlHttp.responseText);

				_set_base(origin_base);
				console.log(origin_base);

				break;
			}
		}
	}

	__main();

})()
