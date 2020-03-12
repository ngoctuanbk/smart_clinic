/* eslint-disable no-const-assign */
/* eslint-disable one-var */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('PaginationFactory', PaginationFactory);

    function PaginationFactory() {
        const service = {
            paginations,
            paginationBsSelect,
        };
        return service;

        function paginations(currentPages, data) {
            let currentPage = currentPages;
            if (typeof (currentPage) === 'undefined') {
                currentPage = 1;
            }
            const maxSize = 5;
            // Default page limits
            const totalPages = data.pages;
            let startPage = 1,
                endPage = totalPages;
            const isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;
            // recompute if maxSize
            const rotate = true;
            if (isMaxSized) {
                if (rotate === true) {
                    // Current page is displayed in the middle of the visible ones
                    startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                    endPage = startPage + maxSize - 1;
                    // Adjust if limit is exceeded
                    if (endPage > totalPages) {
                        endPage = totalPages;
                        startPage = endPage - maxSize + 1;
                    }
                } else {
                    // Visible pages are paginated with maxSize
                    startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;
                    // Adjust last page if limit is exceeded
                    endPage = Math.min(startPage + maxSize - 1, totalPages);
                }
            }

            const pagesArr = [];
            while (startPage < endPage + 1) {
                pagesArr.push(startPage++);
            }
            let flagShow = false;
            if (data.total > data.limit) {
                flagShow = true;
            }
            const pagination = {
                total: data.total,
                pages: pagesArr,
                page: currentPage,
                endPage,
                numberPage: data.pages,
                skip: (currentPage - 1) * data.limit + 1,
                toSkip: (currentPage - 1) * data.limit + data.docs.length,
                length: data.docs.length,
                show: flagShow,
            };
            return pagination;
        }


        function paginationBsSelect(Data) {
            const {
                limit, page, pages, total,
            } = Data;

            if (limit >= total) {
                arrowGroupBsSelect('hide');
            }
            if (limit < total) {
                arrowGroupBsSelect('show');
                if (page === 1) {
                    btnArrowLeftBsSelect('hide', '');
                    btnArrowRightBsSelect('', 'hide');
                }
                if (page > 1) {
                    btnArrowLeftBsSelect('', 'hide');
                }
                if (page < pages) {
                    btnArrowRightBsSelect('', 'hide');
                }
                if (page === pages) {
                    btnArrowRightBsSelect('hide', '');
                }
            }
            return {
                limit, page, pages, total,
            };
        }

        function btnArrowLeftBsSelect(addClass, removeClass) {
            $('.dropdown-menu.open .arrow-group .btn.btn-arrow-left').addClass(addClass).removeClass(removeClass);
        }
        function btnArrowRightBsSelect(addClass, removeClass) {
            $('.dropdown-menu.open .arrow-group .btn.btn-arrow-right').addClass(addClass).removeClass(removeClass);
        }

        function arrowGroupBsSelect(display) {
            $('.dropdown-menu.open .arrow-group').addClass(display === 'show' ? '' : 'hide');
        }
    }
}());
