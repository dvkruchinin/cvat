// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

/// <reference types="cypress" />

import { taskName, labelName } from '../../support/const';

context('Intelligent scissors.', () => {
    const caseId = '77';

    before(() => {
        cy.openTask(taskName);
        cy.openJob();
    });

    describe(`Testing case "${caseId}"`, () => {
        it('Drawning with Intelligent scissors.', () => {
            cy.get('.cvat-tools-control').click();
            cy.get('.cvat-opencv-control-popover-visible').find('.cvat-opencv-initialization-button').click();
        });
    });
});
