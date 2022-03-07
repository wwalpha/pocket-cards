//
//  DailyStudyContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

protocol DailyStudyDisplayLogic {
    func showNext(title: String, choices: [String])

    func showError(index: String)
    
    func showNothing()
}

protocol DailyStudyBusinessLogic {
    func loadQuestion()
    
    func onChoice(choice: String)
    
    func onKnown()
    
    func onUnknown()
}

protocol DailyStudyPresentationLogic {
    func showNext(q: Question)
    
    func showError(index: String)
    
    func showNothing()
}

