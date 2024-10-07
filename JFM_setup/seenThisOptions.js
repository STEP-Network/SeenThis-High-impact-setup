function() {

  // Configuration object for specific domains, allowing overrides
  const seenThisOptions = {
    'avisendanmark.dk': {},
    'dagbladet-holstebro-struer.dk': {},
    'viborg-folkeblad.dk': {},
    'vafo.dk': {},
    'stiften.dk': {},
    'jv.dk': {},
    'hsfo.dk': {},
    'helsingordagblad': {},
    'fyens.dk': {},
    'frdb.dk': {},
    'folkebladetlemvig.dk': {},
    'faa.dk': {},
    'erhvervplus.dk': {},
    'dbrs.dk': {},
    'amtsavisen.dk': {},
    'ugeavisen.dk': {},
    'amagerliv.dk': {},
    'frederiksberg.dk': {},
    'kobenhavnliv.dk': {},
  };

  // Default configuration object for ad units
  const defaultConfig = {
    'topscroll_mobile': {
      template: 'topscroll',
      slot: '{{ pathPrefix }}topscroll_mobile',
      sizes: [[300, 230], [1, 2]],
      peekAmount: '80vh' // Set unique peek amount for topscroll_mobile
    },
    'mobile_2_outstream': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_2_outstream',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh' 
    },
    'mobile_3': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_3',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh' 
    },
    'mobile_4': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_4',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh'
    },
    'mobile_5': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_5',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh'
    },
    'mobile_6': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_6',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh'
    },
    'mobile_7': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_7',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh'
    },
    'mobile_8': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_8',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh'
    },
    'mobile_9': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_9',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh'
    },
    'mobile_dai': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_dai',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '100vh'
    },
  };

  // Check if the current domain has an entry in seenThisOptions
  if (seenThisOptions.hasOwnProperty('{{ mappedDomain }}')) {
    var domainOptions = seenThisOptions['{{ mappedDomain }}'];

    // Even if domainOptions is empty, return the default configuration
    //console.log('domainOptions er vendt retur som true');
    return Object.assign(defaultConfig, domainOptions);
  }

  //console.log('domainOptions er vendt retur som false');
  return null;
}
