'use server'

import type {
    BuildFrameData,
    FrameActionPayload,
    FrameValidatedActionPayload,
} from '@/lib/farcaster'
import { loadGoogleFontAllVariants } from '@/sdk/fonts'
import type { Config, State } from '..'
import { choicesRepresentation } from '../utils'
import ReviewAnswersView from '../views/Review'

export default async function prereview(
    body: FrameActionPayload | FrameValidatedActionPayload,
    config: Config,
    state: State,
    _params: any
): Promise<BuildFrameData> {
    const userId = body.untrustedData.fid.toString()
    const roboto = await loadGoogleFontAllVariants('Roboto')
    const { qna: qnas, ...rest } = config
    const qna = qnas[0]
    console.log('Quizzlet.prereview >> top', { userId, rest })
    console.log('Quizzlet.prereview >> state', state)

    const userAnswer =
        choicesRepresentation[qna.isNumeric ? 'numeric' : 'alpha'][
            state.answers[userId][0].answerIndex
        ]
    const colors = {
        background: config?.background,
        textColor: config?.textColor,
        barColor: config?.barColor,
    }

    return {
        buttons: [{ label: '→' }],
        fonts: roboto,
        state,
        aspectRatio: '1.91:1',
        component: ReviewAnswersView({ qna, qnas, colors, userAnswer, ...rest }),
        functionName: 'review',
    }
}
