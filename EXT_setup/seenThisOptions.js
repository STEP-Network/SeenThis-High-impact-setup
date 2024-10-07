function() {

    // Configuration object for specific domains, allowing overrides
    const seenThisOptions = {
      'madensverden.dk': {},
      'nyheder.dk': {},
      'kendte.dk': {},
    };
  
    // Default configuration object for ad units
    const defaultConfig = {
      'topscroll_mobile': {
        template: 'topscroll',
        slot: '{{ pathPrefix }}topscroll_mobile',
        sizes: [[300, 230], [1, 2]],
        peekAmount: '80vh'
      },
      'mobile_2': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}mobile_2',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh' 
      },
      'mobile_3': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}mobile_3',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh' 
      },
      'mobile_4': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}mobile_4',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh'
      },
      'mobile_5': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}mobile_5',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh'
      },
      'mobile_dai': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}mobile_dai',
        sizes: [[300, 240], [320, 320]],
        peekAmount: '100vh'
      },
    };
  
    // Check if the current domain has an entry in seenThisOptions
    if (seenThisOptions.hasOwnProperty('{{ mappedDomain }}')) {
      var domainOptions = seenThisOptions['{{ mappedDomain }}'];
  
      // Even if domainOptions is empty, return the default configuration
      console.log('domainOptions er vendt retur som true');
      return Object.assign(defaultConfig, domainOptions);
    }
  
    console.log('domainOptions er vendt retur som false');
    return null;
  }