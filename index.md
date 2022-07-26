



# Main Page

## Table of Contents

- [Main Page](#main-page)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Traditional Thermometry](#traditional-thermometry)
  - [Simultaneous Orthogonal Aquisition](#simultaneous-orthogonal-aquisition)
  - [Smearing](#smearing)
  - [Subtracting Baseline For Sparsity](#subtracting-baseline-for-sparsity)
  - [Subtracting  SVD to Reduce Waterflow](#subtracting--svd-to-reduce-waterflow)
  - [ADMM Iterative Step](#admm-iterative-step)
  - [Adding SVD and Baseline for Accurate Pixel Magnitudes](#adding-svd-and-baseline-for-accurate-pixel-magnitudes)
  - [Thermometry](#thermometry)
  - [Code](#code)

## Getting Started

## Traditional Thermometry

[Proton Resonance Frequency Method](thermometry.md)

$\Delta T = c_t\Delta \theta$ where $c_t$ is the temperature radian ratio and $\Delta \theta$ is the change in phase angle between the current image and the baseline.

This can be better seen in this equation where $\theta_{1}$ is the phase angle of the current image and $\theta_{0}$ which is the phase angle of the baseline.

$\Delta T = c_t(\theta_{1}-\theta_{0})$




## Simultaneous Orthogonal Aquisition

## Smearing

## Subtracting Baseline For Sparsity

## Subtracting  SVD to Reduce Waterflow

## ADMM Iterative Step

A more in depth explaination of this step can be found [here](admm.md)
  
## Adding SVD and Baseline for Accurate Pixel Magnitudes

## Thermometry

## Code
```matlab
function [outputVec] = Sa_v(a,v)
    %SA_V Summary of this function goes here
    %   Detailed explanation goes here
    outputVec = zeros(length(v),1);

    for i = 1:length(v)
        real_val = 0;
        imag_val = 0;

        if(real(v(i)) > a)
            real_val = real(v(i)) - a;
        elseif (real(v(i)) < -a) 
            real_val = real(v(i)) + a; 
        else
            real_val = 0;
        end

        if(imag(v(i)) > a)
            imag_val = imag(v(i)) - a;
        elseif (imag(v(i)) < -a) 
            imag_val = imag(v(i)) + a; 
        else
            imag_val = 0;
        end

        outputVec(i) = real_val + j*imag_val;

    end
end
```