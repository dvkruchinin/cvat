// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

/// <reference types="cypress" />

import { taskName, labelName } from '../../support/const_canvas3d';

context('Canvas 3D functionality. Interaction with cuboid via sidebar.', () => {
    const caseId = '78';
    const secondLabel = 'car';

    const screenshotsPath = 'cypress/screenshots/canvas3d_functionality/case_78_canvas3d_functionality_cuboid_label.js';
    const cuboidCreationParams = {
        labelName: labelName,
    };

    before(() => {
        cy.openTask(taskName)
        cy.addNewLabel(secondLabel);
        cy.openJob();
        cy.wait(1000); // Waiting for the point cloud to display
        cy.get('#canvas3d-container').screenshot('canvas3d_before_all');
        cy.create3DCuboid(cuboidCreationParams);
    });

    describe(`Testing case "${caseId}"`, () => {
        it('Activate a cuboid on sidear.', () => {
            cy.get('#cvat-objects-sidebar-state-item-1')
                .trigger('mouseover')
                .should('have.class', 'cvat-objects-sidebar-state-active-item')
                .wait(1000); //Wating for cuboid activation
            cy.get('#canvas3d-container').screenshot('canvas3d_after_activating_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_before_all.png`,
                `${screenshotsPath}/canvas3d_after_activating_cuboid.png`,
            );
        });

        it('Change a label via sidear.', () => {
            cy.get('#cvat-objects-sidebar-state-item-1')
                .find('.cvat-objects-sidebar-state-item-label-selector')
                .type(`${secondLabel}{Enter}`)
                .trigger('mouseout');
            cy.get('#canvas3d-container').screenshot('canvas3d_after_change_label_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_after_activating_cuboid.png`,
                `${screenshotsPath}/canvas3d_after_change_label_cuboid.png`,
            );
        });

        it('Lock/unlock a cuboid via sidear. The control points of the cuboid on the top/side/front view are locked/unlocked.', () => {
            cy.get('#cvat-objects-sidebar-state-item-1')
                .find('.cvat-object-item-button-lock')
                .click(); // Lock the cubiod
            cy.get('.cvat-object-item-button-lock-enabled').should('exist').trigger('mouseout');
            cy.get('#canvas3d-container').screenshot('canvas3d_lock_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_after_change_label_cuboid.png`,
                `${screenshotsPath}/canvas3d_lock_cuboid.png`,
            );
            cy.get('.cvat-object-item-button-lock-enabled').click(); // Unlock the cubiod
            cy.get('.cvat-object-item-button-lock').should('exist').trigger('mouseout');
            cy.get('#canvas3d-container').screenshot('canvas3d_unlock_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_lock_cuboid.png`,
                `${screenshotsPath}/canvas3d_unlock_cuboid.png`,
            );
        });

        it('Switch occluded property for a cuboid via sidear. The cuboid on the perpective view are occluded.', () => {
            cy.get('#cvat-objects-sidebar-state-item-1')
                .find('.cvat-object-item-button-occluded')
                .click(); // Switch occluded property
            cy.get('.cvat-object-item-button-occluded-enabled').should('exist').trigger('mouseout');
            cy.get('#canvas3d-container').screenshot('canvas3d_enable_occlud_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_unlock_cuboid.png`,
                `${screenshotsPath}/canvas3d_enable_occlud_cuboid.png`,
            );
            cy.get('.cvat-object-item-button-occluded-enabled').click(); // Switch occluded property again
            cy.get('.cvat-object-item-button-occluded').should('exist').trigger('mouseout');
            cy.get('#canvas3d-container').screenshot('canvas3d_disable_occlud_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_enable_occlud_cuboid.png`,
                `${screenshotsPath}/canvas3d_disable_occlud_cuboid.png`,
            );
        });

        it('Hide/unhide a cuboid via sidear. The cuboid on the perpective/top/side/front view be hidden/unhidden.', () => {
            cy.get('#cvat-objects-sidebar-state-item-1')
                .find('.cvat-object-item-button-hidden')
                .click(); // Hide the cuboid
            cy.get('.cvat-object-item-button-hidden-enabled').should('exist').trigger('mouseout');
            cy.get('#canvas3d-container').screenshot('canvas3d_hide_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_disable_occlud_cuboid.png`,
                `${screenshotsPath}/canvas3d_hide_cuboid.png`,
            );
            cy.get('.cvat-object-item-button-hidden-enabled').click(); // Unhide the cuboid
            cy.get('.cvat-object-item-button-hidden').should('exist').trigger('mouseout');

            cy.get('#canvas3d-container').screenshot('canvas3d_unhide_cuboid');
            cy.compareImagesAndCheckResult(
                `${screenshotsPath}/canvas3d_hide_cuboid.png`,
                `${screenshotsPath}/canvas3d_unhide_cuboid.png`,
            );
        });
    });
});
