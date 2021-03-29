// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

// /// <reference types="cypress" />

import { taskName } from '../../support/const';

context('Filters functionality.', () => {
    const caseId = '18';
    const labelShape = 'shape 3 points';
    const additionalAttrsLabelShape = [
        { additionalAttrName: 'type', additionalValue: 'shape', typeAttribute: 'Text' },
        { additionalAttrName: 'count points', additionalValue: '3', typeAttribute: 'Text' },
        { additionalAttrName: 'polygon', additionalValue: 'True', typeAttribute: 'Checkbox' },
    ];
    const labelTrack = 'track 4 points';
    const additionalAttrsLabelTrack = [
        { additionalAttrName: 'type', additionalValue: 'track', typeAttribute: 'Text' },
        { additionalAttrName: 'polygon', additionalValue: 'True', typeAttribute: 'Checkbox' },
        { additionalAttrName: 'count points', additionalValue: '4', typeAttribute: 'Text' },
    ];

    const createPolygonShape = {
        reDraw: false,
        type: 'Shape',
        labelName: labelShape,
        pointsMap: [
            { x: 200, y: 200 },
            { x: 250, y: 200 },
            { x: 250, y: 240 },
        ],
        complete: true,
        numberOfPoints: null,
    };
    const createRectangleTrack2Points = {
        points: 'By 2 Points',
        type: 'Track',
        labelName: labelTrack,
        firstX: 260,
        firstY: 200,
        secondX: 360,
        secondY: 250,
    };
    const createRectangleShape4Points = {
        points: 'By 4 Points',
        type: 'Shape',
        labelName: labelShape,
        firstX: 550,
        firstY: 350,
        secondX: 650,
        secondY: 350,
        thirdX: 650,
        thirdY: 450,
        fourthX: 550,
        fourthY: 450,
    };
    const createPolygonTrack = {
        reDraw: false,
        type: 'Track',
        labelName: labelTrack,
        pointsMap: [
            { x: 700, y: 350 },
            { x: 850, y: 350 },
            { x: 850, y: 450 },
            { x: 700, y: 450 },
        ],
        numberOfPoints: 4,
    };

    let cvatCanvasShapeList = [];
    let cvatFiltesList = [];

    function checkingFilterApplication(ids) {
        for (let i = 0; i < cvatCanvasShapeList.length; i++) {
            if (ids.indexOf(cvatCanvasShapeList[i]) > -1) {
                cy.get(`#cvat_canvas_shape_${cvatCanvasShapeList[i]}`).should('exist');
                cy.get(`#cvat-objects-sidebar-state-item-${cvatCanvasShapeList[i]}`).should('exist');
            } else {
                cy.get(`#cvat_canvas_shape_${cvatCanvasShapeList[i]}`).should('not.exist');
                cy.get(`#cvat-objects-sidebar-state-item-${cvatCanvasShapeList[i]}`).should('not.exist');
            }
        }
    }

    before(() => {
        cy.openTask(taskName);
        cy.addNewLabel(labelShape, additionalAttrsLabelShape);
        cy.addNewLabel(labelTrack, additionalAttrsLabelTrack);
        cy.openJob();
    });

    describe(`Testing case "${caseId}"`, () => {
        it('Draw several objects (different shapes, tracks, labels)', () => {
            cy.createPolygon(createPolygonShape);
            cy.createRectangle(createRectangleTrack2Points);
            cy.createRectangle(createRectangleShape4Points);
            cy.createPolygon(createPolygonTrack);
            cy.get('.cvat_canvas_shape').then(($cvatCanvasShapeList) => {
                for (let i = 0; i < $cvatCanvasShapeList.length; i++) {
                    cvatCanvasShapeList.push(Number($cvatCanvasShapeList[i].id.match(/\d+$/)));
                }
            });
        });

        it('Filter: shape == "polygon". Only the polygon exist.', () => {
            const textFilter = 'shape == "polygon"';
            cvatFiltesList.push(textFilter);
            cy.addFiltersRule(0);
            cy.setFilter(0, 0, 'Shape', '==', false, 'polygon', false, false, true); // #cvat_canvas_shape_1,4, #cvat-objects-sidebar-state-item-1,4
            checkingFilterApplication([1, 4]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: (shape == "polygon" || shape == "rectangle"). Only the rectangle and polygon exist.', () => {
            const textFilter = '(shape == "polygon" || shape == "rectangle")';
            cvatFiltesList.push(textFilter);
            cy.addFiltersRule(0);
            cy.setFilter(0, 0, 'Shape', '==', false, 'polygon');
            cy.addFiltersRule(0);
            cy.setGroupConition(0, 'Or');
            cy.setFilter(0, 1, 'Shape', '==', false, 'rectangle', false, false, true); // #cvat_canvas_shape_1,2,3,4, #cvat-objects-sidebar-state-item-1,2,3,4
            checkingFilterApplication([1, 2, 3, 4]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: type == "shape". Only the objects with shape type exist.', () => {
            const textFilter = 'type == "shape"';
            cvatFiltesList.push(textFilter);
            cy.addFiltersRule(0);
            cy.setFilter(0, 0, 'Type', '==', false, 'shape', false, false, true); // #cvat_canvas_shape_1,3, #cvat-objects-sidebar-state-item-1,3
            checkingFilterApplication([1, 3]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: label == "track 4 points". Only the polygon exist.', () => {
            const textFilter = 'label == "track 4 points"';
            cvatFiltesList.push(textFilter);
            cy.addFiltersRule(0);
            cy.setFilter(0, 0, 'Label', '==', false, labelTrack, false, false, true); // #cvat_canvas_shape_2,4, #cvat-objects-sidebar-state-item-2,4
            checkingFilterApplication([2, 4]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: Attributes count points 4. Only the objects with same attr exist.', () => {
            const textFilter = 'attr.track 4 points.count points == "4"';
            cvatFiltesList.push(textFilter);
            cy.addFiltersRule(0);
            cy.setFilter(0, 0, 'Attributes', '==', false, 4, labelTrack, 'count points', true); // #cvat_canvas_shape_2,4, #cvat-objects-sidebar-state-item-2,4
            checkingFilterApplication([2, 4]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: width >= height. All objects exist.', () => {
            const textFilter = 'width >= height';
            cvatFiltesList.push(textFilter);
            cy.addFiltersRule(0);
            cy.setFilter(0, 0, 'Width', '>=', 'Field', 'Height', false, labelTrack, 'count points', true); // #cvat_canvas_shape_1,2,3,4, #cvat-objects-sidebar-state-item-1,2,3,4
            checkingFilterApplication([1, 2, 3, 4]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: objectID == 4. Only the objects with same id exist (polygon track).', () => {
            const textFilter = 'objectID == 4';
            cvatFiltesList.push(textFilter);
            cy.addFiltersRule(0);
            cy.setFilter(0, 0, 'ObjectID', '==', false, 4, false, false, true); // #cvat_canvas_shape_4, #cvat-objects-sidebar-state-item-4
            checkingFilterApplication([4]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: ((label == "shape 3 points" && attr.track 4 points.type == "polylines") || (label == "track 4 points" && width > 60)). Only the objects polygon and rectangle exist.', () => {
            const textFilter =
                '((label == "shape 3 points" && attr.track 4 points.type == "polylines") || (label == "track 4 points" && width > 60))';
            cvatFiltesList.push(textFilter);
            cy.addFiltersGroup(0);
            cy.addFiltersGroup(0);
            cy.setFilter(1, 0, 'Label', '==', false, labelShape); // #cvat_canvas_shape_2,4, #cvat-objects-sidebar-state-item-2,4
            cy.addFiltersRule(1);
            cy.setFilter(1, 1, 'Attributes', '==', false, 'polylines', labelTrack, 'type');
            cy.setFilter(2, 2, 'Label', '==', false, labelTrack);
            cy.addFiltersRule(2);
            cy.setGroupConition(0, 'Or');
            cy.setFilter(2, 3, 'Width', '>', false, '60', false, false, true);
            checkingFilterApplication([2, 4]);
            cy.clearFilters(); // Clear filters
        });

        it('Filter: ((label == "shape 3 points" || (attr.shape 3 points.type == "shape" && width > 50)) && height > 50). Only the rectangle shape exist.', () => {
            const textFilter =
                '((label == "shape 3 points" || (attr.shape 3 points.type == "shape" && width > 50)) && height > 50)';
            cvatFiltesList.push(textFilter);
            cy.addFiltersGroup(0);
            cy.setFilter(1, 0, 'Label', '==', false, labelShape);
            cy.addFiltersGroup(1);
            cy.setGroupConition(1, 'Or');
            cy.setFilter(2, 1, 'Attributes', '==', false, 'shape', labelShape, 'type');
            cy.addFiltersRule(2);
            cy.setFilter(2, 2, 'Width', '>', false, 50);
            cy.addFiltersGroup(0);
            cy.setGroupConition(0, 'And');
            cy.setFilter(3, 3, 'Height', '>', false, 50, false, false, true);
            checkingFilterApplication([3]); // #cvat_canvas_shape_3, #cvat-objects-sidebar-state-item-3
            cy.clearFilters(); // Clear filters
        });

        it('Verify to show all filters', () => {
            cy.сheckFiltersModalOpened();
            cy.get('.recently-used-wrapper').trigger('mouseover');
            cy.get('.ant-dropdown')
                .not('.ant-dropdown-hidden')
                .within(() => {
                    cvatFiltesList.forEach(function (filterValue) {
                        cy.contains('[role="menuitem"]', filterValue);
                    });
                });
        });

        it('Select filter: type == "shape"', () => {
            cy.selectFilterValue('type == "shape"'); // #cvat_canvas_shape_1,3, #cvat-objects-sidebar-state-item-1,3
            checkingFilterApplication([1, 3]);
        });

        it('Select filter: objectID == 4', () => {
            cy.selectFilterValue('objectID == 4'); // #cvat_canvas_shape_4, #cvat-objects-sidebar-state-item-4
            checkingFilterApplication([4]);
        });
    });
});
