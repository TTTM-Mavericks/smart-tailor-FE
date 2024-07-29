import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import style from './VerticalStepperStyle.module.scss'
import { values } from 'core-js/core/array';

const steps = [
    {
        label: 'Not verify',
        description: ``,
        value: 'NOT_VERIFY'
    },
    {
        label: 'Pending',
        description: ``,
        value: 'PENDING'
    },
    {
        label: 'Deposit',
        description:
            '',
        value: 'DEPOSIT',
    },
    {
        label: 'Processing',
        description: ``,
        value: 'PROCESSING'
    },

    {
        label: 'Completed',
        description: ``,
        value: 'COMPLETED'
    },
    {
        label: 'Delivered',
        description: ``,
        value: 'DELIVERED'
    },
];
type props = {
    status?: string
}
const VerticalLinearStepperComponent: React.FC<props> = ({ status }) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    React.useEffect(() => {
        if (status === 'NOT_VERIFY') setActiveStep(0);
        if (status === 'PENDING') setActiveStep(1);
        if (status === 'DEPOSIT') setActiveStep(2);
        if (status === 'PROCESSING') setActiveStep(3);
        if (status === 'COMPLETED') setActiveStep(3);
        if (status === 'DELIVERED') setActiveStep(4);

    }, [status])

    return (
        <div className={`${style.verticalStepper__container}`}>
            <Stepper style={{ width: '60%' }} activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            className={`${style.verticalStepper__container__typography}`}
                            optional={
                                index === steps.length ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            <span>
                                {step.label}
                            </span>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </div>
    );
}

export default VerticalLinearStepperComponent