//
//  HandwritingContract.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//
//

import Foundation
import UIKit

// View logic
protocol HandwritingDisplayLogic {
    func showNext(model: HandwritingViewModel)

    func showError()
}

// Interactor logic
protocol HandwritingBusinessLogic {
    func initialize()

    func confirmAnswer(image: UIImage)
}

// Presenter logic
protocol HandwritingPresentationLogic {
    func showNext(q: Question)

    func showNothing()

    func showError()
}
