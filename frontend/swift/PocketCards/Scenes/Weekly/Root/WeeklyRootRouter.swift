//
//  WeeklyRootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//

import SwiftUI

class WeeklyRootRouter {
    func makeTest(subject: String) -> some View {
        WeeklyChoiceView().configureView(subject: subject)
    }

    func makePractice(subject: String) -> some View {
        WeeklyPracticeView().configureView(subject: subject)
    }
}
