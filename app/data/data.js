// idc = I don't care
// know = Is this something that can be known? (otherwise maybe just a grouping)

const tags = {
  C: {key: 'C', value: 'Concept'},
  JP: {key: 'JP', value: 'JS Primative'},
  JF: {key: 'JF', value: 'JS Function'},
  JM: {key: 'JM', value: 'JS Primative/Element Method'},
  DE: {key: 'DE', value: 'DOM Element'},
  EA: {key: 'EA', value: 'Element Attribute'},
  CP: {key: 'CP', value: 'CSS Property'},
  CV: {key: 'CV', value: 'CSS Value'},
  DT: {key: 'DT', value: 'Data type'},

};

export const skills = [
  {
    title: 'CSS',
    tags: [],
    value: null,
    comment: null,
    rating: null,
    url: null,
    idc: false,
    know: false,
    items: [
      {
        title: 'Media Queries',
        subtitle: 'level 3+4',
        tags: [],
        value: null,
        comment: null,
        rating: null,
        url: null,
        idc: false,
        know: false,
        items: [
          {
            title: '<ratio>',
            subtitle: null,
            tags: [tags.DT],
            value: null,
            comment: null,
            rating: null,
            url: null,
            idc: false,
            know: true,
            items: [],
          },
          {
            title: 'Media features',
            subtitle: '',
            tags: [],
            value: null,
            comment: null,
            rating: null,
            url: null,
            idc: false,
            know: true,
            items: [
              {
                title: 'any-hover',
                subtitle: 'New in level 4',
                tags: [tags.CP],
                value: null,
                comment: null,
                rating: null,
                url: null,
                idc: false,
                know: true,
                items: [
                  {
                    title: 'none',
                    subtitle: '',
                    tags: [tags.CV],
                    value: null,
                    comment: null,
                    rating: null,
                    url: null,
                    idc: false,
                    know: true,
                    items: [],
                  },
                  {
                    title: 'hover',
                    subtitle: '',
                    tags: [tags.CV],
                    value: null,
                    comment: null,
                    rating: null,
                    url: null,
                    idc: false,
                    know: true,
                    items: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   name: 'Javascript',
  //   items: [
  //     {
  //       name: 'EcmaScript language',
  //       items: [
  //         {
  //           name: 'Indexed collections',
  //           items: [
  //             {
  //               name: 'Arrays',
  //               items: [
  //                 {
  //                   name: 'Array.from()',
  //                   description: null,
  //                   example: null,
  //                   url: null,
  //                 },
  //                 {
  //                   name: 'Array.isArray()',
  //                   description: null,
  //                   example: null,
  //                   url: null,
  //                 },
  //                 {
  //                   name: 'Array.of()',
  //                   description: null,
  //                   example: null,
  //                   url: null,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: 'Web APIs',
  //       items: [
  //         {
  //           name: 'DOM',
  //           items: [],
  //         },
  //         {
  //           name: 'WebGL',
  //           items: [],
  //         },
  //         {
  //           name: 'Device APIs',
  //           items: [
  //
  //           ],
  //         },
  //         {
  //           name: 'Web Audio',
  //           items: [],
  //         },
  //       ],
  //     },
  //     {
  //       name: 'NodeJS',
  //       items: [
  //       ],
  //     },
  //   ],
  // },
];
