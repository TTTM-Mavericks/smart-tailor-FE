import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import { styled } from '@mui/system';
import Check from '@mui/icons-material/Check';

const steps = [
    'Step 1: Sign Up Brand Account',
    'Step 2: Fill Brand Information',
    'Step 3: Waiting For Accept/Decline'
];

interface VerticalStepProgressProps {
    activeStep: number;
}

interface CustomStepIconProps {
    active: boolean;
    completed: boolean;
}

const CustomStepIcon = styled('div')<CustomStepIconProps>(({ active, completed }) => ({
    backgroundColor: active ? '#FF7043' : completed ? '#00B400' : '#BDBDBD',
    zIndex: 1,
    color: '#fff',
    width: 24,
    height: 24,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
}));

const VerticalStepProgressComponent: React.FC<VerticalStepProgressProps> = ({ activeStep }) => {
    return (
        <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
                <Step key={label}>
                    <StepLabel
                        StepIconComponent={(props: any) => (
                            <CustomStepIcon active={props.active} completed={props.completed}>
                                {props.completed ? <Check fontSize="small" /> : index + 1}
                            </CustomStepIcon>
                        )}
                    >
                        {label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

export default VerticalStepProgressComponent;
