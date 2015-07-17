/** 
 * The main focus of this test is to prove that an item from
 * the static/content.json "footer" node leads to the dynamic
 * creation of a menu item in the footer.
 * 
 * The language selection mechanism if following the rules 
 * described in ../docs/feature_localization_con10t.md and is implemented
 * on top of the same mechanisms which are already tested in
 * ../test/controllers_projects_spec.js. 
 * So these rules won't be tested here again.
 * 
 * 
 * Author: Daniel M. de Oliveira
 */
describe ('idaiFooter', function() {

	var scope = {};

	var prepare = function (primaryLanguage) {
		module('idai.services', function($provide) {
			$provide.value('language', {
				browserPrimaryLanguage: function () {
					return primaryLanguage;
				}
			});
			$provide.value('transl8', {
				getTranslation: function () {
					return 'translation';
				}
			});
			$provide.constant('arachneSettings', {
				dataserviceUri: '/data'
			});
		});
		module('idai.filters');
		module('idai.directives');
		module('templates');

		
		inject(function($rootScope, $compile, $templateCache,$httpBackend) {
			
			template = $templateCache.get('partials/directives/idai-footer.html');
			$templateCache.put('app/partials/directives/idai-footer.html',template);
			
			$httpBackend.expectGET('info/content.json').respond(200,'{\
				"id": "",\
				"children": [\
				{"id":"header"},\
				{\
					"id": "footer",\
					"children": [\
						{\
							"id": "imprint",\
							"title": {\
								"de": "Impressum",\
								"en": "Imprint"\
							}}]}]}');
			
			
		    scope = $rootScope.$new();
			$templateCache.put();
		    element =
		        '<idai-footer></idai-footer>';

		    scope.size = 100;
		    element = $compile(element)(scope);
		    scope.$digest();
			$httpBackend.flush();
		});
	};
		
	it ('show german menu item',function(){
		prepare('de');
		expect(element.find('p').eq(1).find('a').eq(0).text()).toBe("Impressum");
	});
	
		
	it ('show english menu item',function(){
		prepare('en');
		expect(element.find('p').eq(1).find('a').eq(0).text()).toBe("Imprint");
	});
});
