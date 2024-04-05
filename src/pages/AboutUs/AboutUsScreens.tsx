import { Container, Typography, makeStyles } from '@mui/material'
import React from 'react'
import CarouselComponent from './CarouselComponent'
import AboutUsContent from './AboutUsContent'
import VerticalGridSlide from './AboutUsVerticalCarouselComponent'

export default function AboutUsScreens() {
    return (
        <Container>
            <VerticalGridSlide />
            <AboutUsContent />
            <CarouselComponent />
        </Container>
    )
}
