function() {

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
    // desktop setup
    'topscroll_1': {
      template: 'topscroll',
      slot: '{{ pathPrefix }}topscroll_1',
      sizes: [[1, 2]],
      peekAmount: '80vh'
    },
    'billboard_2': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}billboard_2',
      sizes: [[970, 570], [930, 600]],
      peekAmount: '75vh' 
    },
    'billboard_3': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}billboard_3',
      sizes: [[970, 570], [930, 600]],
      peekAmount: '75vh' 
    },
    'billboard_4': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}billboard_4',
      sizes: [[970, 570], [930, 600]],
      peekAmount: '75vh' 
    },
    // mobile setup
    'topscroll_mobile': {
      template: 'topscroll',
      slot: '{{ pathPrefix }}topscroll_mobile',
      sizes: [[300, 230], [1, 2]],
      peekAmount: '80vh'
    },
    'mobile_2_outstream': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_2_outstream',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh' 
    },
    'mobile_3': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_3',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh' 
    },
    'mobile_4': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_4',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_5': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_5',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_6': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_6',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_7': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_7',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_8': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_8',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_9': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_9',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_dai': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}{{ pathOverride }}mobile_dai',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
  };

  if (seenThisOptions.hasOwnProperty('{{ mappedDomain }}')) {
    var domainOptions = seenThisOptions['{{ mappedDomain }}'];

    return Object.assign(defaultConfig, domainOptions);
  }

  return null;
}