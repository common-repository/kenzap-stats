/**
 * BLOCK: stats-1
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import Edit from './edit';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    title: __( 'Creative', 'kenzap-stats' ),
    description: __( 'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 'kenzap-stats' ),
    sign: '75',
    color: '#333',
    color2: '#333',
};

export const defaultSubBlocks = JSON.stringify( [
    {
        title: __( 'Creative', 'kenzap-stats' ),
        description: __( 'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 'kenzap-stats' ),
        sign: '75',
        color: '#333',
        color2: '#333',
        key: new Date().getTime() + 1,
    }, {
        title: __( 'Illustrative', 'kenzap-stats' ),
        description: __( 'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 'kenzap-stats' ),
        sign: '50',
        color: '#333',
        color2: '#333',
        key: new Date().getTime() + 2,
    }, {
        title: __( 'Beautiful', 'kenzap-stats' ),
        description: __( 'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 'kenzap-stats' ),
        sign: '90',
        color: '#333',
        color2: '#333',
        key: new Date().getTime() + 3,
    }, {
        title: __( 'Easy and Fun', 'kenzap-stats' ),
        description: __( 'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 'kenzap-stats' ),
        sign: '83',
        color: '#333',
        color2: '#333',
        key: new Date().getTime() + 3,
    },
] );

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100wh' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
        '--textColor': `${ attributes.textColor }`,
        '--textColor2': `${ attributes.textColor2 }`,
        '--textOutColor': `${ attributes.textOutColor }`,
        '--textThickness': `${ parseInt(attributes.textThickness) * 100 }`,
        '--fontWeight': `${ parseInt(attributes.fontWeight) * 100 }`,
        '--numberSize': `${ attributes.numberSize }px`,
        '--circleSize': `${ attributes.circleSize }px`,
        '--titleSize': `${ attributes.titleSize }px`,
        '--descriptionSize': `${ attributes.descriptionSize }px`,
    };

    return {
        vars,
        kenzapContanerStyles,
    };
};

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kenzap/stats-3', {
    title: __( 'Kenzap Circles 1', 'kenzap-stats' ),
    icon: 'clock',
    category: 'layout',
    keywords: [
        __( 'Stats', 'kenzap-stats' ),
        __( 'Circles', 'kenzap-stats' ),
        __( 'Timer', 'kenzap-stats' ),
    ],
    anchor: true,
    html: true,
    attributes: {
        ...blockProps,

        elements: {
            type: 'number',
            default: 4,
        },

        numberSize: {
            type: 'number',
            default: 34,
        },

        circleSize: {
            type: 'number',
            default: 176,
        },

        titleSize: {
            type: 'number',
            default: 19,
        },

        descriptionSize: {
            type: 'number',
            default: 15,
        },

        textThickness: {
            type: 'number',
            default: 3,
        },

        fontWeight: {
            type: 'number',
            default: 7,
        },

        showTitle: {
            type: 'boolean',
            default: true,
        },

        showDesc: {
            type: 'boolean',
            default: true,
        },

        textColor: {
            type: 'string',
            default: '#333',
        },

        textColor2: {
            type: 'string',
            default: '#333',
        },

        textOutColor: {
            type: 'string',
            default: '#333',
        },

        items: {
            type: 'array',
            default: [],
        },

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },

        randomValue: {
            type: 'string',
            default: '',
        },
    },

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );
            // TODO It is very bad solution to avoid low speed working of setAttributes function
            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }
        
        setTimeout(function(){launchCircle($);},500);

        return ( <Edit { ...props } /> );
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function( props ) {
        const {
            className,
            attributes,
        } = props;

        const { vars, kenzapContanerStyles } = getStyles( props.attributes );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-stats-1 block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    style={ vars }
                    withBackground
                    withPadding
                    >

                    <div className="kenzap-container" style={ kenzapContanerStyles }>

                        <div class="kenzap-row kp-circle-cont" data-time={ attributes.time } data-delay={ attributes.delay }>
                            { attributes.items && attributes.items.map( ( item, index ) => (
                                
                                <div class="kenzap-col-4">
                                    <div class="stat-box" title={ __( 'Adjust values on the right' ) }>

                                        <div class="kp-circle" data-size={ attributes.circleSize } data-border={ attributes.textThickness } data-color={ item.color } data-value={ parseInt(item.sign)/100 }>
                                            <canvas className="kp-rem" width={ attributes.circleSize } height={ attributes.circleSize } ></canvas>
                                            <strong style={{ color: item.color2 }}></strong>
                                        </div>
                                        { attributes.showTitle && <h3>{ item.title }</h3> }
                                        { attributes.showDesc && <p>{ item.description }</p> }

                                    </div>
                                </div>

                            ) ) }
                        </div>

                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
