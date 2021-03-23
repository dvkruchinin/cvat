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
        testShowTooltipOnButton(button, expectedTooltipText);
        cy.get('.cvat-canvas3d-perspective').screenshot(screenshotNameAfter);
        compareImages(`${screenshotNameBefore}.png`, `${screenshotNameAfter}.png`);
    }

    function testShowTooltipOnButton(button, expectedTooltipText) {
        cy.contains(expectedTooltipText).should('exist').and('be.visible');
        cy.get(button).trigger('mouseout');
        cy.contains(expectedTooltipText).should('not.exist');
    }

    before(() => {
        cy.openTaskJob(taskName);
        cy.get('.cvat-contextImage-show').should('be.visible');
    });

    describe(`Testing case "${caseId}"`, () => {
        it('Testing perspective visual regressions by clicking on the buttons with the mouse.', () => {
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-arrow-directions-icons-up',
                'Arrow Up',
                'before_click_uparrow',
                'after_click_uparrow',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-arrow-directions-icons-down',
                'Arrow Down',
                'before_click_downarrow',
                'after_click_downarrow',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-arrow-directions-icons-left',
                'Arrow Left',
                'before_click_leftarrow',
                'after_click_leftarrow',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-arrow-directions-icons-right',
                'Arrow Right',
                'before_click_rightarrow',
                'after_click_rightarrow',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-directions-icon-move-up',
                'Alt+U',
                'before_click_move_up',
                'after_click_move_up',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-directions-icon-move-down',
                'Alt+O',
                'before_click_move_down',
                'after_click_move_down',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-directions-icon-zoom-in',
                'Alt+I',
                'before_click_zoom_in',
                'after_click_zoom_in',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-directions-icon-zoom-out',
                'Alt+K',
                'before_click_zoom_out',
                'after_click_zoom_out',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-directions-icon-move-left',
                'Alt+J',
                'before_click_move_left',
                'after_click_move_left',
            );
            testPerspectiveChangeOnButtonClick(
                '.cvat-canvas3d-perspective-directions-icon-move-right',
                'Alt+L',
                'before_click_move_right',
                'after_click_move_right',
            );
        });
    });
});
