(function () {
    angular.module('SmartClinic')
        .service('DashboardsService', DashboardsService);

        DashboardsService.$inject = ['$http', 'exception'];

    function DashboardsService($http, exception) {
        this.countChannels = function (data) {
            return $http.get('/admin/dashboards/countChannels', {
                params: data
            }).then((response) => {
                return response.data
            }).catch(() => {
                handlingError('Có lỗi xảy ra khi hiển thị danh sách kênh bán')
            }); 
        };

        this.countCategories = function (data) {
            return $http.get('/admin/dashboards/countCategories', {
                params: data
            }).then((response) => {
                return response.data
            }).catch(() => {
                handlingError('Có lỗi xảy ra khi hiển thị danh sách ngành bán')
            }); 
        }

        this.getOrderByDate = function (data) {
            return $http.get('/admin/dashboards/orderByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách đơn hàng ', err)
            });
        };

        this.getTopProductsByDate = function (data) {
            return $http.get('/admin/dashboards/topProductsByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách sản phẩm ', err)
            });
        };

        this.getTopUserByDate = function (data) {
            return $http.get('/admin/dashboards/topUserByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách nhân viên ', err)
            });
        };

        this.getTopAgencyByDate = function (data) {
            return $http.get('/admin/dashboards/topAgencyByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách đại lý ', err)
            });
        };

        this.getTopPlacesByDate = function (data) {
            return $http.get('/admin/dashboards/topPlacesByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách địa điểm ', err)
            });
        };

        this.getTopChannelsByDate = function (data) {
            return $http.get('/admin/dashboards/topChannelsByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách kenh ', err)
            });
        };

        this.getPlaceByDate = function (data) {
            return $http.get('/admin/dashboards/placeByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách địa điểm ', err)
            });
        };

        this.getPlaceList = function (data) {
            return $http.get('/admin/places/list', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách địa điểm ', err)
            });
        }

        this.getTargetListByDate = function (data) {
            return $http.get('/admin/targets/listByDate', {
                params: data
            }).then((response) => {
                return(response.data);
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách chỉ tiêu ', err)
            });
        }

        this.getAllGroups = function () {
            return $http.get('/admin/groups/listAllGroups')
                .then((response) => {
                    return response.data;
                }).catch((err) => {
                    return handlingError('Lỗi xảy ra khi hiển thị danh sách nhóm ', err)
                })
        };

        this.listAllBranch = function (data) {
            return $http.get('/admin/branches/listActive', {
                params: data
            }).then((response) => {
                return response.data;
            }).catch((err) => {
                return handlingError('Lỗi xảy ra khi hiển thị danh sách chi nhánh ',err)
            })
        }

        this.getSaleChartMonthData = function(datas, numberDate, year, month) {
            let saleChartDatas = [];
            if ( month < 10) {
                month = "0"+ month;
            }
            if (numberDate && numberDate >1) {
                for (let i = 1; i <= numberDate; i++) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    let obj = {
                        "date": year + "-" + month + "-" + i,
                        "revenue": null,
                        "volume": null
                    };
                    saleChartDatas.push(obj);
                };
            }
            if (saleChartDatas && saleChartDatas.length) {
                saleChartDatas.forEach(saleChartData => {
                    let total_revenue = null;
                    let total_volume = null;
                    if (datas && datas.length) {
                        datas.forEach(data => {
                            if (moment(saleChartData.date).format('YYYY-MM-DD') == moment(data.CreatedDate).format('YYYY-MM-DD')) {
                                total_revenue += data.TotalAmount;
                                total_volume += data.TotalQuantity;
                            }
                        });
                    }
                    if (total_revenue) {
                        saleChartData.revenue = (total_revenue / 1000000).toFixed(2);
                    }
                    if (total_volume) {
                        saleChartData.volume = total_volume.toFixed(2);
                    }
                });
                for (let i = saleChartDatas.length - 1; i > 0; i--) {
                    if (saleChartDatas[i] && saleChartDatas[i].revenue) {
                        saleChartDatas[i].dashLengthColumn = 5;
                        saleChartDatas[i].alpha = 0.2;
                        saleChartDatas[i-1].dashLengthLine = 5;
                        break;
                    }
                }
            }
            return saleChartDatas;
        }

        this.getSaleChartYearData = function(datas, year) {
            let saleChartDatas = [];
            for (let i = 1; i <= 12; i++) {
                if (i < 10) {
                    i = "0" + i;
                }
                let obj = {
                    "date": year + "-01-" + i,
                    "revenue": null,
                    "volume": null
                };
                saleChartDatas.push(obj);
            };
            if (saleChartDatas && saleChartDatas.length) {
                saleChartDatas.forEach(saleChartData => {
                    let total_revenue = null;
                    let total_volume = null;
                    if (datas && datas.length) {
                        datas.forEach(data => {
                            if (moment(saleChartData.date).format('DD') == moment(data.CreatedDate).format('MM')) {
                                total_revenue += data.TotalAmount;
                                total_volume += data.TotalQuantity;
                            }
                        });
                    }
                    if (total_revenue) {
                        saleChartData.revenue = (total_revenue / 1000000).toFixed(2);
                    }
                    if (total_volume) {
                        saleChartData.volume = total_volume.toFixed(2);
                    }
                });
                for (let i = saleChartDatas.length - 1; i > 0; i--) {
                    if (saleChartDatas[i] && saleChartDatas[i].revenue) {
                        saleChartDatas[i].dashLengthColumn = 5;
                        saleChartDatas[i].alpha = 0.2;
                        saleChartDatas[i-1].dashLengthLine = 5;
                        break;
                    }
                }
            }
            return saleChartDatas;
        }

        this.getSaleChartQuarterData = function(datas, year, quarter) {
            let saleChartDatas = [
                { "date": "", "revenue": null, "volume": null },
                { "date": "", "revenue": null, "volume": null },
                { "date": "", "revenue": null, "volume": null },
            ];
            if (quarter === "1") {
                saleChartDatas[0].date = year + "-01-01";
                saleChartDatas[1].date = year + "-01-02";
                saleChartDatas[2].date = year + "-01-03";
            } else if (quarter === "2") {
                saleChartDatas[0].date = year + "-01-04";
                saleChartDatas[1].date = year + "-01-05";
                saleChartDatas[2].date = year + "-01-06";
            } else if (quarter === "3") {
                saleChartDatas[0].date = year + "-01-07";
                saleChartDatas[1].date = year + "-01-08";
                saleChartDatas[2].date = year + "-01-09";
            } else {
                saleChartDatas[0].date = year + "-01-10";
                saleChartDatas[1].date = year + "-01-11";
                saleChartDatas[2].date = year + "-01-12";
            }
            if (saleChartDatas && saleChartDatas.length) {
                saleChartDatas.forEach(saleChartData => {
                    let total_revenue = null;
                    let total_volume = null;
                    if (datas && datas.length) {
                        datas.forEach(data => {
                            if (moment(saleChartData.date).format('DD') == moment(data.CreatedDate).format('MM')) {
                                total_revenue += data.TotalAmount;
                                total_volume += data.TotalQuantity;
                            }
                        });
                    }
                    if (total_revenue) {
                        saleChartData.revenue = (total_revenue / 1000000).toFixed(2);
                    }
                    if (total_volume) {
                        saleChartData.volume = total_volume.toFixed(2);
                    }
                });
                for (let i = saleChartDatas.length - 1; i > 0; i--) {
                    if (saleChartDatas[i] && saleChartDatas[i].revenue) {
                        saleChartDatas[i].dashLengthColumn = 5;
                        saleChartDatas[i].alpha = 0.2;
                        saleChartDatas[i-1].dashLengthLine = 5;
                        break;
                    }
                }
            }
            return saleChartDatas;
        }

        this.getTopProductsChartData = function(datas) {
            let TopProductsChartData = [{
                    name: "",
                    revenue: null,
                    color: "#85C5E3",
                },
                {
                    name: "",
                    revenue: null,
                    color: "#E284D7",
                },
                {
                    name: "",
                    revenue: null,
                    color: "#E2BE84",
                }
            ];
            for (let i = 0; i < TopProductsChartData.length; i++) {
                TopProductsChartData[i].name = datas && datas[i] && datas[i]._id ? datas[i]._id.ProductName : "";
                TopProductsChartData[i].revenue = datas && datas[i] ? datas[i].TotalQuantity : 0;
            }
            return TopProductsChartData;
        }

        this.getTopUserChartData = function(datas) {
            let topMembers = [{
                    "name": "",
                    "revenue": null,
                    "color": "#85C5E3",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#84A8E2",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#9783E1",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#D184E2",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#E284BB",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#E28684",
                },
            ];
            for (let i = 0; i < topMembers.length; i++) {
                topMembers[i].name = datas && datas[i] && datas[i]._id ? datas[i]._id.UserName : "";
                topMembers[i].revenue = datas && datas[i] ? datas[i].TotalQuantity : 0;
            }
            return topMembers;
        }

        this.getTopAgencyChartData = function(datas) {
            let topAgencies = [{
                    "name": "",
                    "revenue": null,
                    "color": "#85C5E3",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#9783E1",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#E284BB",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#E28684",
                },
            ];
            for (let i = 0; i < topAgencies.length; i++) {
                topAgencies[i].name = datas && datas[i] && datas[i]._id ? datas[i]._id.AgencyName : "";
                topAgencies[i].revenue = datas && datas[i] ? (datas[i].TotalAmount / 1000000).toFixed(2) : 0;
            }
            return topAgencies;
        }

        this.getLowAgencyChartData = function(datas) {
            let leastData = [];
            if (datas && datas.length && datas.length >= 1) {
                for (let i = datas.length - 1; i >= 0; i--) {
                    leastData.push(datas[i]);
                }
            }
            let lowAgencies = [{
                    "name": "",
                    "revenue": null,
                    "color": "#E28684",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#E284BB",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#9783E1",
                },
                {
                    "name": "",
                    "revenue": null,
                    "color": "#85C5E3",
                },
            ];
            for (let i = 0; i < lowAgencies.length; i++) {
                lowAgencies[i].name = leastData && leastData[i] && leastData[i]._id ? leastData[i]._id.AgencyName : "";
                lowAgencies[i].revenue = leastData && leastData[i] ? (leastData[i].TotalAmount / 1000000).toFixed(2) : 0;
            }
            return lowAgencies;
        }

        this.getRevenuePlacesChartData = function(datas) {
            let revenuePlacesChartData = [];
            if (datas && datas.length) {
                datas.forEach(data => {
                    let obj = {
                        channel: data && data._id ? data._id.City : "",
                        revenue: data ? parseFloat((data.TotalAmount / 1000000).toFixed(2)) : 0,
                    }
                    revenuePlacesChartData.push(obj);
                });
            }
            return revenuePlacesChartData;
        }

        this.getQuantityPlacesChartData = function(datas) {
            let quantityPlacesChartData = [];
            if (datas && datas.length) {
                datas.forEach(data => {
                    let obj = {
                        channel: data && data._id ? data._id.City : "",
                        revenue: data ? parseFloat(data.TotalQuantity) : 0,
                    }
                    quantityPlacesChartData.push(obj);
                });
            }
            return quantityPlacesChartData;
        }

        this.getChannelChartData = function(datas) {
            // // Places
            // let Total = datas ? datas.Total : 0;
            // let detailChannels = datas ? datas.detailChannel : [];
            // let allTotalChannel = 0;
            // let channelChartData = [];
            // if (detailChannels && detailChannels.length) {
            //     for(let i = 0; i < detailChannels.length; i++){
            //         let obj = {
            //             channelName : detailChannels[i].Channels.length ? detailChannels[i].Channels[0].Name : "",
            //             channelCode : detailChannels[i].Channels.length ? detailChannels[i].Channels[0].ChannelCode : "",
            //             percent : (detailChannels[i].Total * 100 ) / Total,
            //             color : "#67"+ (parseInt(Math.floor((Math.random() * 100) + 1))).toString() + 'DC',
            //         };
            //         allTotalChannel += obj.percent;
            //         channelChartData.push(obj);
            //     };
            // }
            // if(allTotalChannel !== 100){
            //     let obj = {
            //         percent : 100 - allTotalChannel,
            //         channelName: 'Khu vực chưa có kênh bán',
            //         color: '#CC4748'
            //     }
            //     channelChartData.push(obj);
            // }

            // Orders
            let Total = 0;
            let allTotalChannel = 0;
            let channelChartData = [];
            let colors = ["#FFFF00", "#6495ED", "#006400", "#A52A2A", "#008B8B", "#9932CC", "#DAA520", "#808080"];
            if (datas && datas.length) {
                for(let i = 0; i < datas.length; i++){
                    Total += datas[i].TotalAmount;
                };
                datas.forEach(data => {
                    let j = Math.floor(Math.random() * colors.length);
                    let obj = {
                        channelName : data._id ? data._id.ChannelName : "",
                        percent : (data.TotalAmount * 100) / Total,
                        color : colors[j],
                    };
                    colors.splice(j, 1);
                    allTotalChannel += obj.percent;
                    channelChartData.push(obj);
                })
            }
            if(allTotalChannel !== 100){
                let obj = {
                    percent : 100 - allTotalChannel,
                    channelName: 'Khu vực chưa có kênh bán',
                    color: '#CC4748'
                }
                channelChartData.push(obj);
            }
            return channelChartData;
        }

        this.getCategoryChartData = function(datas) {
            let categoryChartData = [];
            if (datas && datas.length) {
                datas.forEach(data => {
                    let obj = {
                        category: data._id.ParentCategoryName ? data._id.ParentCategoryName : "",
                        revenue: data ? data.TotalQuantity : 0,
                    }
                    categoryChartData.push(obj);
                });
            }
            return categoryChartData;
        }

        this.getRevenueYearlyChartData = function(currentDatas, lastDatas) {
            let revenueYearlyChartDatas = [];
            for (let i = 1; i <= 12; i++) {
                let obj = {
                    "month": i,
                    "lastYear": 0,
                    "currentYear": 0,
                    "color": "#F8AF46",
                    "color1": "#6EBCFC"
                };
                revenueYearlyChartDatas.push(obj);
            };
            revenueYearlyChartDatas.forEach(revenueYearlyChartData => {
                let total_current_revenue = null;
                let total_last_revenue = null;
                if (currentDatas && currentDatas.length) {
                    currentDatas.forEach(currentData => {
                        if (revenueYearlyChartData.month == (new Date(currentData.CreatedDate).getMonth() + 1)) {
                            total_current_revenue += currentData.TotalAmount;
                        }
                    });
                }
                if (lastDatas && lastDatas.length) {
                    lastDatas.forEach(lastData => {
                        if (revenueYearlyChartData.month == (new Date(lastData.CreatedDate).getMonth() + 1)) {
                            total_last_revenue += lastData.TotalAmount;
                        }
                    });
                }
                if (total_current_revenue) {
                    revenueYearlyChartData.currentYear = (total_current_revenue / 1000000).toFixed(2);
                }
                if (total_last_revenue) {
                    revenueYearlyChartData.lastYear = (total_last_revenue / 1000000).toFixed(2);
                }
            });
            return revenueYearlyChartDatas;
        }

        this.getTargetRevenueChartData = function(orders, targets) {
            let targetRevenueChartDatas = [];
            for (let i = 1; i <= 12; i++) {
                let obj = {
                    "month": i,
                    "revenue": 0,
                    "total": 100,
                    "volume": 0,
                    "color": "#67B7DC",
                    "color1": "#B2DAEC"
                };
                targetRevenueChartDatas.push(obj);
            };
            targetRevenueChartDatas.forEach(data => {
                let total_revenue = null;
                let total_target = null;
                
                if (orders && orders.length) {
                    orders.forEach(order => {
                        if (data.month === (new Date(order.CreatedDate).getMonth() + 1)) {
                            total_revenue += order.TotalAmount;
                        }
                    });
                }
                if (targets && targets.length) {
                    targets.forEach(target => {
                        if (target.Status === 'Active' && target.TypeOfDate === 'Month' && data.month === (new Date(target.FromTime).getMonth() + 1)) {
                            total_target += target.Revenue;
                        }
                    });
                }
                if (total_target && total_revenue) {
                    data.revenue = ((total_revenue / total_target) * 100).toFixed(2);
                    data.volume = ((total_revenue / total_target) * 100).toFixed(2);
                }
            });
            return targetRevenueChartDatas;
        }

        this.getQuantityYearlyChartData = function(currentDatas, lastDatas) {
            let quantityYearlyChartDatas = [];
            for (let i = 1; i <= 12; i++) {
                let obj = {
                    "month": i,
                    "lastYear": 0,
                    "currentYear": 0,
                    "color": "#F8AF46",
                    "color1": "#6EBCFC"
                };
                quantityYearlyChartDatas.push(obj);
            };
            quantityYearlyChartDatas.forEach(quantityYearlyChartData => {
                let total_current_quantity = null;
                let total_last_quantity = null;
                if (currentDatas && currentDatas.length) {
                    currentDatas.forEach(currentData => {
                        if (quantityYearlyChartData.month == (new Date(currentData.CreatedDate).getMonth() + 1)) {
                            total_current_quantity += currentData.TotalQuantity;
                        }
                    });
                }
                if (lastDatas && lastDatas.length) {
                    lastDatas.forEach(lastData => {
                        if (quantityYearlyChartData.month == (new Date(lastData.CreatedDate).getMonth() + 1)) {
                            total_last_quantity += lastData.TotalQuantity;
                        }
                    });
                }
                if (total_current_quantity) {
                    quantityYearlyChartData.currentYear = total_current_quantity;
                }
                if (total_last_quantity) {
                    quantityYearlyChartData.lastYear = total_last_quantity;
                }
            });
            return quantityYearlyChartDatas;
        }

        this.getLeaderBoardChartData = function(datas) {
            let topLeader = [{
                "name": "",
                "sales": null,
                "color": "#7F8DA9",
                "bullet": null,
            }, {
                "name": "",
                "sales": null,
                "color": "#FEC514",
                "bullet": null,
            }, {
                "name": "",
                "sales": null,
                "color": "#DB4C3C",
                "bullet": null,
            }, {
                "name": "",
                "sales": null,
                "color": "#DAF0FD",
                "bullet": null,
                "iconClass": "icon",
            },{
                "name": "",
                "sales": null,
                "color": "#DAF0FD",
                "bullet": null,
            }];

            for (let i = 0; i<topLeader.length; i++) {
                topLeader[i].name = datas && datas[i] && datas[i]._id ? datas[i]._id.UserName : "";
                topLeader[i].sales = datas && datas[i] ? parseFloat((datas[i].TotalAmount / 1000000).toFixed(2)) : 0;
                topLeader[i].bullet = datas && datas[i] ? "/assets/pages/media/profile/avatar_01.jpg" : "";
            }
            return topLeader;
        }

        function handlingError(msg, error) {
            return exception.catcher(msg)(error);
        }
    }
})();