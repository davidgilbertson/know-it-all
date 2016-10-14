// idc = I don't care
// know = Is this something that can be known? (otherwise maybe just a grouping)

import {
  SCORES,
  TAGS,
} from '../constants.js';

// by doing it this way (objects instead of array):
// the tree is no more or less complex
// I can still use Object.keys() and iterate down the tree to set a 'path' prop for each
// when I define a path to an object `top.items.css.items.mediaQueries.items` it will
// continue to work even if the data structure changes
// whereas with arrays and [0, 0, 0, 1, 2] it very brittle.

const differentTreeIdea = {
  items: {
    top: {
      name: `TOP`,
      items: {
        css: {
          name: `CSS`,
          tags: [],
          items: {
            mediaQueries: {
              name: `Media Queries`,
              tags: [],
              items: {
                ratio: {
                  name: `<ratio>`,
                  tags: [],
                },
                mediaFeatures: {
                  name: `Media features`,
                  tags: [],
                },
              },
            },
          },
        },
      },
    },
  },
};

export const nuggetTreeData = {
  items: [
    {
      name: `TOP`,
      tags: [],
      value: null,
      comment: null,
      score: SCORES.LEVEL_0,
      url: null,
      idc: false,
      knowable: false,
      isCode: false,
      items: [
        {
          name: `CSS`,
          tags: [],
          value: null,
          comment: null,
          score: SCORES.LEVEL_0,
          url: null,
          idc: false,
          knowable: false,
          isCode: false,
          items: [
            {
              name: `Media Queries`,
              subtitle: `level 3+4`,
              tags: [],
              value: null,
              comment: null,
              score: SCORES.LEVEL_0,
              url: null,
              idc: false,
              knowable: false,
              isCode: false,
              items: [
                {
                  name: `<ratio>`,
                  subtitle: null,
                  tags: [TAGS.DT],
                  value: null,
                  comment: null,
                  score: SCORES.LEVEL_0,
                  url: null,
                  idc: false,
                  knowable: true,
                  isCode: true,
                  items: [],
                },
                {
                  name: `Media features`,
                  subtitle: ``,
                  tags: [],
                  value: null,
                  comment: null,
                  score: SCORES.LEVEL_0,
                  url: null,
                  idc: false,
                  knowable: false,
                  isCode: false,
                  items: [
                    {
                      name: `any-hover`,
                      subtitle: `New in level 4`,
                      tags: [TAGS.CP],
                      value: null,
                      comment: null,
                      score: SCORES.LEVEL_2,
                      url: null,
                      idc: false,
                      knowable: false,
                      isCode: true,
                      items: [
                        {
                          name: `none`,
                          subtitle: ``,
                          tags: [TAGS.CV],
                          value: null,
                          comment: null,
                          score: SCORES.LEVEL_1,
                          url: null,
                          idc: false,
                          knowable: true,
                          isCode: true,
                          items: [],
                        },
                        {
                          name: `hover`,
                          subtitle: ``,
                          tags: [TAGS.CV],
                          value: null,
                          comment: null,
                          score: SCORES.LEVEL_3,
                          url: null,
                          idc: false,
                          knowable: true,
                          isCode: true,
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
      ],
    },
  ],
};
