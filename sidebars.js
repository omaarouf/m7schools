/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {

  couresSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Home',
    },
    {
      type: 'category',
      label: 'Conception Reseau',
      collapsed: true,
      items: [
        // Intro
        'idosr/networking/intro',

        // Groupe 0
        {
          type: 'category',
          label: 'Configuration de Base',
          items: [
            'idosr/networking/configuration-de-base/switch',
            'idosr/networking/configuration-de-base/router',
          ],
        },

        // Groupe 1
        {
          type: 'category',
          label: 'Switching',
          items: [
            'idosr/networking/switching/vlans',
            'idosr/networking/switching/stp',
            'idosr/networking/switching/etherchannel',
          ],
        },

        // Groupe 2
        {
          type: 'category',
          label: 'Routage',
          items: [
            'idosr/networking/routing/routage-statique',
            'idosr/networking/routing/rip',
            'idosr/networking/routing/ospf',
            'idosr/networking/routing/eigrp',
            'idosr/networking/routing/bgp',
          ],
        },

        // Groupe 3
        {
          type: 'category',
          label: 'Securite',
          items: [
            'idosr/networking/securite/port-security',
            'idosr/networking/securite/acl',
          ],
        },

        // Groupe 4
        {
          type: 'category',
          label: 'Gestion & Monitoring',
          items: [
            'idosr/networking/gestion-monitoring/gestion-reseau',
          ],
        },

        // Groupe 5
        {
          type: 'category',
          label: 'Services Reseau',
          items: [
            'idosr/networking/services-reseau/hsrp',
            'idosr/networking/services-reseau/dhcp',
            'idosr/networking/services-reseau/nat',
            'idosr/networking/services-reseau/voip',
            'idosr/networking/services-reseau/vpn',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'idosr/windows/intro',
        'idosr/windows/lesson-01',
        'idosr/windows/lesson-02',
        'idosr/windows/lesson-03',
        'idosr/windows/lesson-04',
        'idosr/windows/lesson-05',
        'idosr/windows/lesson-06',
        'idosr/windows/lesson-07',
        'idosr/windows/lesson-08',
      ],
    },
    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'idosr/linux/intro',
        'idosr/linux/lesson-00',
        'idosr/linux/lesson-01',
        'idosr/linux/lesson-02',
        'idosr/linux/lesson-03',
        'idosr/linux/lesson-04',
        'idosr/linux/lesson-05',
        'idosr/linux/lesson-06',
        'idosr/linux/lesson-07',
        'idosr/linux/lesson-08',
        'idosr/linux/lesson-09',
        'idosr/linux/lesson-10',
        'idosr/linux/lesson-11',
        'idosr/linux/lesson-12',
      ],
    },
  ],

  quizzesSidebar: [
    {
    type: 'doc',
    id: 'quizzes/quizzes-intro',
    label: 'Quizzes',
    },
  
    {
      type: 'category',
      label: 'Conception Reseau',
      collapsed: true,
      items: [
        'quizzes/quiz-networking',
      ],
    },
    
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'quizzes/quiz-windows',
      ],
    },
    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'quizzes/linux/quizz-00-les-commandes-de-base',
        'quizzes/linux/ConfigurationDeBaseLinuxServer',
        'quizzes/linux/quizzDhcp',
        'quizzes/linux/quizzDNS',
        'quizzes/linux/quizzApache',
        'quizzes/linux/quizzLVM',
        'quizzes/linux/quizzRoutage',
        'quizzes/linux/quizzRaid',
        'quizzes/linux/quiz-ldap',
        'quizzes/linux/quiz-linux',
      ],
    },
      
    
  ],

  TpSidebar: [
    {
    type: 'doc',
    id: 'TP/tp-intro',
    label: 'TP Pratiques',
    },
    {
      type: 'category',
      label: 'Conception Reseau',
      collapsed: true,
      items: [
        'TP/networking/conception-reseau',
      ],
    },
    {
      type: 'category',
      label: 'Administration Windows',
      collapsed: true,
      items: [
        'TP/windows/windows',
      ],
    },
    {
      type: 'category',
      label: 'Administration Linux',
      collapsed: true,
      items: [
        'TP/linux/tp-lesson-00',
        'TP/linux/tp-Configuration-de-base',
        'TP/linux/tp-DHCP',
        'TP/linux/tp-DNS',
        'TP/linux/tp-Apache',
        'TP/linux/tp-LVM',
        'TP/linux/tp-Routage',
        'TP/linux/tp-Raid',
      ],
    },  
  ],

};

module.exports = sidebars;