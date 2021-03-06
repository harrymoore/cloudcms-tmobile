define(function(require, exports, module) {

    // require("css!./page-list.css");

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var OneTeam = require("oneteam");
    var bundle = Ratchet.Messages.using();

    return Ratchet.GadgetRegistry.register("tmobile-ui-page-list", DocList.extend({

        configureDefault: function()
        {
            this.base();

            this.config({
                "observables": {
                    "query": "page-list_query",
                    "sort": "page-list_sort",
                    "sortDirection": "page-list_sortDirection",
                    "searchTerm": "page-list_searchTerm",
                    "selectedItems": "page-list_selectedItems"
                }
            });
        },

        setup: function()
        {
            this.get("/projects/{projectId}/tmobile-ui-page-list", this.index);
        },

        entityTypes: function()
        {
            return {
                "plural": "Pages",
                "singular": "Page"
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
            query._type = "tmobile:page";
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

        _componentLinkUri: function(row, model, context)
        {
            var self = this;
            var project = self.observable("project").get();

            return "/#/projects/" + project._doc + "/documents/" + row.id + "/properties";
        },

        iconClass: function(row)
        {
            return "form-icon-32";
        },

        customizeActionContext: function(actionContext, model, button)
        {
               if (!actionContext.model) { actionContext.model = {}; }
               actionContext.model.typeQName = "tmobile:page";
               actionContext.model.formKey = "master";
        },

        columnValue: function(row, item, model, context)
        {
            var self = this;
            var projectId = self.observable("project").get().getId();
            var clientid = row._doc;

            var value = this.base(row, item);

            if (item.key === "page") {

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

                    // var date;
                    // date = new Date(systemMetadata.modified_on.ms);
                    // value += "<p class='list-row-info modified'>Modified " + bundle.relativeDate(date);
                    // value += " by " + OneTeam.filterXss(systemMetadata.modified_by) + "</p>";

                    // date = new Date(systemMetadata.created_on.ms);
                    // value += "<p class='list-row-info created'>Created " + bundle.relativeDate(date);
                    // value += " by " + OneTeam.filterXss(systemMetadata.created_by) + "</p>";
                }
            } else if (item.key === "pageType") {
                value = "<p>" + row.pageType + "</p>";
            } else if (item.key === "sharedComponents") {
                var components = [];
                if (row.layout1 && row.layout1.useSharedComponents) {
                    components.push(row.layout1.useSharedComponents);
                }
                if (row.layout2 && row.layout2.useSharedComponents) {
                    components.push(row.layout2.useSharedComponents);
                }

                value = components.length + " components(s) used";
                for(i = 0; i < components.length; i++) {
                    var linkUri = this._componentLinkUri(components[i], model, context);

                    value +=  "<h2 class='list-row-info title'>";
                    value += "<a href='" + linkUri + "'>";
                    value += OneTeam.filterXss(components[i].title || row.id) + " (" + OneTeam.filterXss(components[i].typeQName) + ")";
                    value += "</a>";
                    value += "</h2>";

                    // value += "<p class='list-row-info'>" + OneTeam.filterXss(components[i].title) + " (" + OneTeam.filterXss(components[i].typeQName) + ")</p>";
                }
                value += "</ul>";
            }

            return value;
        }

    }));

});
