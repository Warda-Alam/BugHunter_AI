 integrationService.invokeOperation("getReportList", {}, payload,
  function(response) {
    voltmx.application.dismissLoadingScreen();

    // Composite service — Report and Observation sub-calls each carry
    // their own opstatus (opstatus_queryReport..., opstatus_queryObservation...).
    // The top-level `opstatus` can be non-zero (partial failure) even when
    // `reports` came back fine, so don't gate rendering on it.
    if (response && Array.isArray(response.reports)) {

      if (response.reports.length === 0) {
        voltmx.print("ℹ️ getReportList returned zero reports.");
      }
      if (response.opstatus !== 0) {
        voltmx.print("⚠️ getReportList composite service partial failure — opstatus: " +
          response.opstatus + " errmsg: " + (response.errmsg || ""));
      }

      var totalCount = response.totalCount || response.reports.length;
      self.gridState.totalPages = Math.ceil(totalCount / self.gridState.pageSize) || 1;

      var processedRecords = response.reports.map(function(item) {
        var statusKey = (item.status || "").toLowerCase().trim();

        var actionText = "View";
        var actionStyle = "filled";
        if (statusKey === "draft") {
          actionText = "Edit";
          actionStyle = "hollow";
        } else if (statusKey === "returned") {
          actionText = "Re Submit";
          actionStyle = "hollow";
        }

        return {
          reportIdDisplay: item.reportId,
          busNo: item.busNo || item.tripId || "-",
          route: item.route || item.driver || "-",
          driver: item.driver || "",
          submittedAtDisplay: item.submittedAt ? item.submittedAt.substring(0, 10) : "",
          statusKey: statusKey,
          statusDisplay: self.formatStatus(item.status),
          actionText: actionText,
          actionStyle: actionStyle,
          reportData: item
        };
      });

      processedRecords.sort(function(a, b) {
        var idA = parseInt(a.reportIdDisplay, 10) || 0;
        var idB = parseInt(b.reportIdDisplay, 10) || 0;
        return idB - idA;
      });

      self.syncGridStructure(processedRecords, self.gridState.totalPages);
    } else {
      voltmx.print("⚠️ Failed to parse service response correctly — no reports array found.");
      // Push an empty table instead of leaving the grid stuck on "Loading..."
      self.syncGridStructure([], 1);
    }
  },
  function(error) {
    voltmx.application.dismissLoadingScreen();
    voltmx.print("❌ Error fetching reports: " + JSON.stringify(error));
    // Same reasoning — an error callback should also clear the grid's
    // internal loading state, not leave it spinning forever.
    self.syncGridStructure([], 1);
  }
);