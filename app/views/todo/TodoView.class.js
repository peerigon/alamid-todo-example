"use strict";

var alamid = require("alamid"),
    constants = require("../../constants.js"),
    $ = alamid.util.jQuery,
    View = alamid.View;

var TodoView = View.extend("TodoView", {

    template: require("./TodoView.html"),

    __nodeMap: null,

    constructor: function () {
        this._super();
        this.__nodeMap = this._nodeMap;
        this.__initNodeEvents();

        this.on("beforeRender", this.__onBeforeRender, this);
    },

    __onBeforeRender: function () {

        var completed = this._model.get("completed");

        $(this.__nodeMap.todoListItem).toggleClass("completed", completed);
    },

    __initNodeEvents: function () {
        var self = this;

        this._addNodeEvents({
            destroyButton: {
                click: function () {
                    self.__model.destroy(function onModelDestroy(err) {
                        if (err) throw err;
                    });
                }
            },
            completed: {
                click: function () {
                    self.__model.toggle();
                }
            },
            title: {
                dblclick: function () {
                    $(self.__nodeMap.todoListItem).addClass("editing");
                    self.__nodeMap.titleEdit.value = self.__model.get("title");
                    self.__nodeMap.titleEdit.focus();
                }
            },
            titleEdit: {
                blur: function () {
                    var newTitle = this.value.trim(),
                        todoModel = self.__model;

                    $(self.__nodeMap.todoListItem).removeClass("editing");
                    if (newTitle) {

                        todoModel.set("title", newTitle);

                        todoModel.save(function onModelSave(err) {
                            if (err) throw err;
                        });
                    } else {
                        todoModel.destroy(function onModelDestroy(err) {
                            if (err) throw err;
                        });
                    }

                },
                keypress: function (event) {
                    if (event.which === constants.KEY_ENTER) {
                        this.blur();
                    }
                }
            }
        });

    }

});

module.exports = TodoView;