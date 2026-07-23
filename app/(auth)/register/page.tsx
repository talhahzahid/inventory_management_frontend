

"use client";


import { UiButton } from '@/components/Button'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function register() {
    return (
        <>
            <h1>Onboard Screen</h1>
            <div className="space-y-4">
                <UiButton buttonText="Default" />

                <UiButton
                    buttonText='alert'
                    variant="primary"
                    onClick={() => alert("Primary")}
                />

                <UiButton
                    variant="primary"
                    className="w-full"
                >
                    Secondary Button
                </UiButton>

                <UiButton
                    disabled
                >
                    Disabled
                </UiButton>
            </div>
        </>
    )
}
