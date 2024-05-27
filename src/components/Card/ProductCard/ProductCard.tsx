import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProductCardStyle.module.scss';
import { Fragment, useState } from 'react'
import { shirtModel } from '../../../assets';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type Props = {
    object: any;
    onClick?: () => void;
    style?: React.CSSProperties;
    className?: string;
};

const ProductCard: React.FC<Props> = ({ object, onClick, style, className }) => {
    return (
        <div className={styles.card__container} style={style} onClick={onClick} >
            <img
                src={object.imgUrl}
                title="green iguana"
            />
            <div className={styles.card__content} >
                <Typography gutterBottom variant="body2" color="text.secondary">
                    {object.title}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                    {object.brand}
                </Typography>
            </div>
            <div>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </div>
        </div>
    );
};



export default ProductCard;