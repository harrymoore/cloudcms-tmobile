define(function(require, exports, module) {

    // require("css!./component-list.css");

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var OneTeam = require("oneteam");
    var bundle = Ratchet.Messages.using();

    return Ratchet.GadgetRegistry.register("tmobile-ui-component-list", DocList.extend({

        configureDefault: function()
        {
            this.base();

            this.config({
                "observables": {
                    "query": "component-list_query",
                    "sort": "component-list_sort",
                    "sortDirection": "component-list_sortDirection",
                    "searchTerm": "component-list_searchTerm",
                    "selectedItems": "component-list_selectedItems"
                }
            });
        },

        setup: function()
        {
            this.get("/projects/{projectId}/tmobile-ui-component-list", this.index);
        },

        entityTypes: function()
        {
            return {
                "plural": "Components",
                "singular": "Component"
            };
        },

        doclistDefaultConfig: function()
        {
            var config = this.base();
            config.columns = [];

            return config;
        },

        doGitanaQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;
            var user = self.observable("user").get();

            query = {};

            if (OneTeam.isEmptyOrNonExistent(query) && searchTerm)
            {
                query = OneTeam.searchQuery(searchTerm, ["title"]);
            }
            query._type = "tmobile:component";
            // if (user) {
            //     query._system = {
            //         modified_by: user.name
            //     }
            // }

            pagination.sort = {
                "_system.modified_on.ms": -1
            };

            OneTeam.projectBranch(self, function () {

                var rows = [];

                this.queryNodes(query, pagination).then(function () {
                    callback(this);
                });
            });
        },

        _linkUri: function(row, model, context)
        {
            var self = this;
            var project = self.observable("project").get();

            return "/#/projects/" + project._doc + "/documents/" + row._doc + "/properties";
        },

        iconClass: function(row)
        {
            return "form-icon-32";
        },

        customizeActionContext: function(actionContext, model, button)
        {
               if (!actionContext.model) { actionContext.model = {}; }
               actionContext.model.typeQName = "tmobile:component";
               actionContext.model.formKey = "master";
        },

        columnValue: function(row, item, model, context)
        {
            var self = this;
            var projectId = self.observable("project").get().getId();
            var clientid = row.clientid;

            var value = this.base(row, item);

            if (item.key === "component") {

                var linkUri = this._linkUri(row, model, context);

                value =  "<h2 class='list-row-info title'>";
                value += "<a href='" + linkUri + "'>";
                value += OneTeam.filterXss(row.title || row._doc);
                value += "</a>";
                value += "</h2>";

                // summary
                // var summary = "";
                // summary += "Definition: " + OneTeam.filterXss(row.definition.title) + " (<a href='#/projects/" + projectId + "/documents/" + definitionId + "'>" + OneTeam.filterXss(row.definition.qname) + "</a>)";
                // value += "<p class='list-row-info summary'>" + summary + "</p>";
                if (row.__system()) {
                    var systemMetadata = row.__system();

                    var date;
                    date = new Date(systemMetadata.modified_on.ms);
                    value += "<p class='list-row-info modified'>Modified " + bundle.relativeDate(date);
                    value += " by " + OneTeam.filterXss(systemMetadata.modified_by) + "</p>";

                    date = new Date(systemMetadata.created_on.ms);
                    value += "<p class='list-row-info created'>Created " + bundle.relativeDate(date);
                    value += " by " + OneTeam.filterXss(systemMetadata.created_by) + "</p>";
                }
            } else if (item.key === "type") {
                value = "<p>" + row.type + "</p>";
            } else if (item.key === "resources") {
                var resources = row.resources || [];
                value = resources.length + " resource(s) attached";
                // for(i = 0; i < resources.length; i++) {
                    // value += "<li><p class='list-row-info>" + OneTeam.filterXss(resources[i].ResourceTitle) + "</p></li>";
                //     value += "<p class='list-row-info>" + OneTeam.filterXss(resources[i].ResourceTitle) + "</p>";
                // }
                // value += "</ul>";
            }

            return value;
        }

    }));

});
