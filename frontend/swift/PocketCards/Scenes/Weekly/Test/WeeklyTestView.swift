//
//  WeeklyTestView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

struct WeeklyTestView: View {
    var interactor: WeeklyTestBusinessLogic?

    @ObservedObject var viewModel = WeeklyTestViewModel()

    var body: some View {
        if viewModel.isLoading {
            Text("Loading....")
        } else if viewModel.isFinish {
            Text("テストは終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            // Language
//            if viewModel.subject == SUBJECT.LANGUAGE {
//                ChoiceQuestion(
//                    question: viewModel.title,
//                    choices: viewModel.choices,
//                    isShowError: "",
//                    onChoice: interactor!.onChoice
//                )
//            } else {
            // Society or Science
//            FlashCard(
//                question: viewModel.title,
//                answer: viewModel.answer,
//                action: interactor!.onAction,
//                onPlay: interactor!.onPlay
//            )
//            }
            FlashCard(question: viewModel.question!, action: interactor!.onAction)
        }
    }
}

extension WeeklyTestView: WeeklyTestDisplayLogic {
    func showNext(model: WeeklyTestViewModel) {
        viewModel.isLoading = false
        viewModel.question = model.question
    }

    func showNothing() {
        viewModel.isFinish = true
    }
}

extension WeeklyTestView {
    func configureView(groupIds: [String]) -> some View {
        var view = self
        let interactor = WeeklyTestInteractor()
        let presenter = WeeklyTestPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        interactor.loadQuestion(groupIds: groupIds)

        view.viewModel.isLoading = true

        return view
    }
}

struct WeeklyTestView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyTestView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
