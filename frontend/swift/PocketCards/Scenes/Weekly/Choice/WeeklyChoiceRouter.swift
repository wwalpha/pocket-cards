//
//  WeeklyChoiceRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/26.
//

import SwiftUI

class WeeklyChoiceRouter {
    func makeTest(groupId: String) -> some View {
        WeeklyTestView().configureView(groupId: groupId)
    }

    func makePractice(groupId: String) -> some View {
        WeeklyPracticeView().configureView(groupId: groupId)
    }
}
