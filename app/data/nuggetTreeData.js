// idc = I don't care
// know = Is this something that can be known? (otherwise maybe just a grouping)

import {
  SCORES,
  TAGS,
} from '../constants.js';

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
