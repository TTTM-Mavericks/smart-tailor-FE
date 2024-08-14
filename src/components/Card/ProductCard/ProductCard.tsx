import React from 'react';
import styles from './ProductCardStyle.module.scss';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DesignInterface, ExpertTailoringInterface } from '../../../models/DesignModel';

type Props = {
    object: ExpertTailoringInterface | DesignInterface;
    onClick?: () => void;
    style?: React.CSSProperties;
    className?: string;
};

const ProductCard: React.FC<Props> = ({ object, onClick, style, className }) => {
    // Determine the image URL and name based on the type of object
    const imageUrl = (object as ExpertTailoringInterface).modelImageUrl || (object as DesignInterface).imageUrl || '';
    const name = (object as ExpertTailoringInterface).expertTailoringName || (object as DesignInterface).expertTailoringName || '';

    return (
        <div className={`${styles.card__container} ${className || ''}`} style={style} onClick={onClick}>
            <img
                src={imageUrl}
                alt={name || 'Image'}
                title={name || 'Image'}
                className={styles.card__image}
            />
            <div className={styles.card__content}>
                <Typography gutterBottom variant="body2" color="text.secondary">
                    {name || ''}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                    {/* Additional content here */}
                </Typography>
            </div>
            <div className={styles.card__actions}>
                {/* <Button size="small">Share</Button>
                <Button size="small">Learn More</Button> */}
            </div>
        </div>
    );
};

export default ProductCard;