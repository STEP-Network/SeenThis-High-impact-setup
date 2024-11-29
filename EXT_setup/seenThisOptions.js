function() {

  // Configuration object for specific domains, allowing overrides
  const seenThisOptions = {
    'example1.dk': {},
    'example2.dk': {},
    'example3.dk': {
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
        peekAmount: '75vh' 
      },
      'billboard_2': {
        template: 'midscroll',
        slot: '{{ pathPrefix }}billboard_2',
        sizes: [[930, 600], [970, 570]],
        peekAmount: '75vh' 
      },
    },
  };

  /* JASPE 28 nov 2024
    Default configuration object for ad units
    Only setup defaults for mobile midscroll, mobile topscroll and deskstop topscroll.
    Midscroll desktop are handled only in the overrides section
  */
 
  const defaultConfig = {
    'topscroll_mobile': {
      template: 'topscroll',
      slot: '{{ pathPrefix }}topscroll_mobile',
      sizes: [[300, 230], [1, 2]],
      peekAmount: '80vh'
    },
    'topscroll_desktop': {
      template: 'topscroll',
      slot: '{{ pathPrefix }}desktop',
      sizes: [[1, 2]],
      peekAmount: '80vh'
    },
    'mobile_2': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}mobile_2',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh' 
    },
    'mobile_3': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}mobile_3',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh' 
    },
    'mobile_4': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}mobile_4',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_5': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}mobile_5',
      sizes: [[300, 240], [320, 320]],
      peekAmount: '75vh'
    },
    'mobile_dai': {
      template: 'midscroll',
      slot: '{{ pathPrefix }}mobile_dai',
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