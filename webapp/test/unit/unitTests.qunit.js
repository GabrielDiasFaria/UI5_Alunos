/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ovly/fiori35/alunos/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
