// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

/// <reference types="cypress" />

import { taskName } from '../../support/const_canvas3d';

context('Canvas 3D functionality. Control button. Mouse interaction.', () => {
    const caseId = '63';
    const screenshotsPath =
        'cypress/screenshots/canvas3d_functionality/case_63_canvas3d_functionality_control_button_mouse_interaction.js';

    function compareImages(imgBefore, imgAfter) {
        cy.compareImages(`${screenshotsPath}/${imgBefore}`, `${screenshotsPath}/${imgAfter}`).then((diffPercent) => {
            expect(diffPercent).to.be.gt(0);
        });
    }

    function testPerspectiveChangeOnButtonClick(
        button,
        expectedTooltipText,
        screenshotNameBefore,
        screenshotNameAfter,
    ) {
        cy.get('.cvat-canvas3d-perspective').screenshot(screenshotNameBefore);
        cy.get(button).click();
        testShowTooltipOnMousemoveToButton(button, expectedTooltipText);
        cy.get('.cvat-canvas3d-perspective').screenshot(screenshotNameAfter);
        compareImages(`${screenshotNameBefore}.png`, `${screenshotNameAfter}.png`);
    }

    function testShowTooltipOnMousemoveToButton(button, expectedTooltipText) {
        cy.contains(expectedTooltipText).should('exist').and('be.visible');
        cy.get(button).trigger('mouseout');
        cy.contains(expectedTooltipText).should('not.exist');
    }

    before(() => {
        cy.openTaskJob(taskName);
        cy.get('.cvat-contextImage').should('be.visible');
    });

    describe(`Testing case "${caseId}"`, () => {
        it('Testing perspective visual regressions by clicking on the buttons with the mouse.', () => {
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-arrow-directions-icons-up',
                'Arrow Up',
                'before_click_uparrow',
                'after_click_uparrow',
            );
        });
    });
});
