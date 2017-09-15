var ViewFile = function (fileData) {

    var self = this;
    this.viewFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle(fileData.name);

    return this.viewFilePanel.append(
        this.panelTitleBar
    );

};
